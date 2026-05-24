import { NextRequest, NextResponse } from 'next/server'
import { SurveyFacade } from '../../../lib/patterns/Facade'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const response = SurveyFacade.submit(body)
    return NextResponse.json({ ok: true, id: response.id }, { status: 201 })
  } catch (err) {
    console.error('[API/submit] Error:', err)
    return NextResponse.json({ ok: false, error: 'Error al guardar la respuesta' }, { status: 500 })
  }
}
