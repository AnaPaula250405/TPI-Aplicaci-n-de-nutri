import { NextRequest, NextResponse } from 'next/server'
import { SurveyFacade } from '../../../lib/patterns/Facade'
import { getStore } from '../../../lib/store/ResponseStore'

export async function GET(req: NextRequest) {
  // RNF #7 — solo admin puede ver resultados
  const auth = req.headers.get('x-admin-token')
  if (auth !== process.env.ADMIN_PASSWORD) {
    getStore().log('WARN', 'API/results', 'Acceso no autorizado')
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  try {
    const results = SurveyFacade.getResults()
    return NextResponse.json(results)
  } catch (err) {
    getStore().log('ERROR', 'API/results', `Error: ${err}`)
    return NextResponse.json({ error: 'Error al obtener resultados' }, { status: 500 })
  }
}
