import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../lib/store/ResponseStore'
import { getDb, initDb } from '../../../lib/db'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-token')
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  try {
    let csv = 'id,timestamp,genero,consumiriaNuevamente,compraria,mejoraria,nivelAgrado,saborPredominante,dulzor,humedad,color\n'

    if (process.env.DATABASE_URL || process.env.STORAGE_URL) {
      await initDb()
      const sql = getDb()
      const rows = await sql`SELECT * FROM survey_responses ORDER BY timestamp ASC`
      rows.forEach((r: Record<string, unknown>) => {
        csv += `"${r.id}","${r.timestamp}","${r.genero}","${r.consumiria_nuevamente}","${r.compraria}","${r.mejoraria}","${r.nivel_agrado}","${r.sabor_predominante}","${r.dulzor}","${r.humedad}","${r.color}"\n`
      })
    } else {
      csv = getStore().toCSV()
    }

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="respuestas-budin-${Date.now()}.csv"`,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: `Error: ${err}` }, { status: 500 })
  }
}
