import { NextRequest, NextResponse } from 'next/server'
import { SurveyFacade } from '../../../lib/patterns/Facade'
import { checkRateLimit } from '../../../lib/middleware/rateLimit'
import { getStore } from '../../../lib/store/ResponseStore'

export async function POST(req: NextRequest) {
  // RNF #14 — rate limiting
  const ip = req.headers.get('x-forwarded-for') || 'unknown'
  const { allowed } = checkRateLimit(ip)
  if (!allowed) {
    getStore().log('WARN', 'API/submit', `Rate limit excedido para IP: ${ip}`)
    return NextResponse.json({ ok: false, error: 'Demasiadas solicitudes. Esperá un momento.' }, { status: 429 })
  }

  try {
    const body = await req.json()

    // RNF #6 — prevención de duplicados
    if (body.sessionToken && getStore().isTokenUsed(body.sessionToken)) {
      return NextResponse.json({ ok: false, error: 'Ya enviaste una respuesta en esta sesión.' }, { status: 409 })
    }

    const response = SurveyFacade.submit(body)
    return NextResponse.json({ ok: true, id: response.id }, { status: 201 })
  } catch (err) {
    getStore().log('ERROR', 'API/submit', `Error: ${err}`)
    return NextResponse.json({ ok: false, error: 'Error al guardar la respuesta' }, { status: 500 })
  }
}
