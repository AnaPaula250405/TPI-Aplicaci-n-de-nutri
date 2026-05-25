import { NextRequest, NextResponse } from 'next/server'
import { SurveyFacade } from '../../../lib/patterns/Facade'
import { getStore, SurveyResponse } from '../../../lib/store/ResponseStore'
import { getDb, initDb } from '../../../lib/db'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-token')
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    // Intentar leer desde base de datos
    if (process.env.DATABASE_URL || process.env.STORAGE_URL) {
      await initDb()
      const sql = getDb()
      const rows = await sql`SELECT * FROM survey_responses ORDER BY timestamp DESC`

      // Convertir filas de DB al formato SurveyResponse
      const responses: SurveyResponse[] = rows.map((r: Record<string, unknown>) => ({
        id: r.id as string,
        timestamp: r.timestamp as string,
        sessionToken: r.session_token as string,
        genero: r.genero as SurveyResponse['genero'],
        consumiriaNuevamente: r.consumiria_nuevamente as SurveyResponse['consumiriaNuevamente'],
        compraria: r.compraria as SurveyResponse['compraria'],
        mejoraria: JSON.parse(r.mejoraria as string || '[]'),
        mejoriaOtro: r.mejoria_otro as string || '',
        nivelAgrado: Number(r.nivel_agrado),
        saborPredominante: r.sabor_predominante as string,
        dulzor: r.dulzor as SurveyResponse['dulzor'],
        humedad: r.humedad as SurveyResponse['humedad'],
        color: r.color as SurveyResponse['color'],
      }))

      // Procesar con Facade+Strategy
      const results = SurveyFacade.getResultsFromData(responses)
      return NextResponse.json(results)
    }

    // Fallback memoria
    const results = SurveyFacade.getResults()
    return NextResponse.json(results)

  } catch (err) {
    getStore().log('ERROR', 'API/results', `Error: ${err}`)
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 })
  }
}
