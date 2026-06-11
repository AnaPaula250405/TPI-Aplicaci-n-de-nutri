// API para obtener los resultados (solo admin)
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
    if (process.env.DATABASE_URL || process.env.STORAGE_URL || process.env.POSTGRES_URL) {
      await initDb()
      const sql = getDb()
      const rows = await sql`SELECT * FROM survey_responses ORDER BY timestamp DESC`

      const responses: SurveyResponse[] = rows.map((r: Record<string, unknown>) => {
        // Parsear mejoraria que puede venir como string JSON, array, o texto plano
        let mejoraria: string[] = []
        try {
          const val = r.mejoraria
          if (Array.isArray(val)) {
            mejoraria = val
          } else if (typeof val === 'string' && val.startsWith('[')) {
            mejoraria = JSON.parse(val)
          } else if (typeof val === 'string' && val.length > 0) {
            mejoraria = [val]
          }
        } catch {
          mejoraria = []
        }

        return {
          id: r.id as string,
          timestamp: r.timestamp as string,
          sessionToken: r.session_token as string,
          genero: r.genero as string,
          consumiriaNuevamente: r.consumiria_nuevamente as string,
          compraria: r.compraria as string,
          mejoraria,
          mejoriaOtro: r.mejoria_otro as string || '',
          nivelAgrado: Number(r.nivel_agrado) || 0,
          saborPredominante: r.sabor_predominante as string,
          dulzor: r.dulzor as string,
          humedad: r.humedad as string,
          color: r.color as string,
          crujiente: r.crujiente as string || 'nada',
          precioPagar: Number(r.precio_pagar) || 0,
        }
      })

      const results = SurveyFacade.getResultsFromData(responses)
      return NextResponse.json(results)
    }

    const results = SurveyFacade.getResults()
    return NextResponse.json(results)

  } catch (err) {
    getStore().log('ERROR', 'API/results', `Error: ${err}`)
    return NextResponse.json({ error: `Error al obtener resultados: ${err}` }, { status: 500 })
  }
}
