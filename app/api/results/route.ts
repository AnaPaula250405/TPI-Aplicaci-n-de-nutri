import { NextResponse } from 'next/server'
import { SurveyFacade } from '../../../lib/patterns/Facade'

export async function GET() {
  try {
    const results = SurveyFacade.getResults()
    return NextResponse.json(results)
  } catch (err) {
    console.error('[API/results] Error:', err)
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 })
  }
}
