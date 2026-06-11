// API para recibir y guardar una respuesta del formulario
import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '../../../lib/middleware/rateLimit'
import { getStore } from '../../../lib/store/ResponseStore'
import { SurveyFacade } from '../../../lib/patterns/Facade'
import { getDb, initDb } from '../../../lib/db'

export async function POST(req: NextRequest) {
  // Verificar que la IP no excedió el límite de requests
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json({ ok: false, error: 'Demasiadas solicitudes. Esperá un momento.' }, { status: 429 })
  }

  try {
    const body = await req.json()

    // Si hay base de datos, guardar ahí
    if (process.env.DATABASE_URL || process.env.STORAGE_URL || process.env.POSTGRES_URL) {
      await initDb()
      const sql = getDb()

      // Verificar que este token no fue usado antes
      const existing = await sql`SELECT id FROM survey_responses WHERE session_token = ${body.sessionToken}`
      if (existing.length > 0) {
        return NextResponse.json({ ok: false, error: 'Ya enviaste una respuesta en esta sesión.' }, { status: 409 })
      }

      const id = `resp_${Date.now()}_${Math.random().toString(36).substr(2,6)}`
      await sql`
        INSERT INTO survey_responses (
          id, timestamp, session_token, genero, consumiria_nuevamente,
          compraria, mejoraria, mejoria_otro, nivel_agrado,
          sabor_predominante, dulzor, humedad, color, crujiente, precio_pagar
        ) VALUES (
          ${id}, ${new Date().toISOString()}, ${body.sessionToken || id},
          ${body.genero}, ${body.consumiriaNuevamente}, ${body.compraria},
          ${JSON.stringify(body.mejoraria)}, ${body.mejoriaOtro || ''},
          ${body.nivelAgrado}, ${body.saborPredominante},
          ${body.dulzor}, ${body.humedad}, ${body.color},
          ${body.crujiente || 'nada'}, ${body.precioPagar || 0}
        )
      `
      getStore().log('INFO', 'API/submit', `Guardado en DB: ${id}`)
      return NextResponse.json({ ok: true, id }, { status: 201 })
    }

    // Sin base de datos: guardar en memoria
    if (body.sessionToken && getStore().isTokenUsed(body.sessionToken)) {
      return NextResponse.json({ ok: false, error: 'Ya enviaste una respuesta.' }, { status: 409 })
    }
    const response = SurveyFacade.submit(body)
    return NextResponse.json({ ok: true, id: response.id }, { status: 201 })

  } catch (err) {
    getStore().log('ERROR', 'API/submit', `Error: ${err}`)
    return NextResponse.json({ ok: false, error: 'Error al guardar la respuesta.' }, { status: 500 })
  }
}
