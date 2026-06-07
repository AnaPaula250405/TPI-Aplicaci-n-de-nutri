// API para obtener los resultados (solo admin)
import { NextRequest, NextResponse } from 'next/server'
import { SurveyFacade } from '../../../lib/patterns/Facade'
import { getStore, SurveyResponse } from '../../../lib/store/ResponseStore'
import { getDb, initDb } from '../../../lib/db'

export async function GET(req: NextRequest) {
  // Solo el admin puede ver los resultados
  const auth = req.headers.get('x-admin-token')
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    if (process.env.DATABASE_URL || process.env.STORAGE_URL) {
      await initDb()
      const sql = getDb()
      const rows = await sql`SELECT * FROM survey_responses ORDER BY timestamp DESC`

      // Convertir las filas de la BD al formato que usa la app
      const responses: SurveyResponse[] = rows.map((r: Record<string, unknown>) => ({
        id: r.id as string,
        timestamp: r.timestamp as string,
        sessionToken: r.session_token as string,
        genero: r.genero as string,
        consumiriaNuevamente: r.consumiria_nuevamente as string,
        compraria: r.compraria as string,
        mejoraria: JSON.parse(r.mejoraria as string || '[]'),
        mejoriaOtro: r.mejoria_otro as string || '',
        nivelAgrado: Number(r.nivel_agrado),
        saborPredominante: r.sabor_predominante as string,
        dulzor: r.dulzor as string,
        humedad: r.humedad as string,
        color: r.color as string,
        crujiente: r.crujiente as string || 'nada',
        precioPagar: Number(r.precio_pagar) || 0,
      }))

      const results = SurveyFacade.getResultsFromData(responses)
      return NextResponse.json(results)
    }

    // Sin base de datos: usar memoria
    const results = SurveyFacade.getResults()
    return NextResponse.json(results)

  } catch (err) {
    getStore().log('ERROR', 'API/results', `Error: ${err}`)
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 })
  }
}
