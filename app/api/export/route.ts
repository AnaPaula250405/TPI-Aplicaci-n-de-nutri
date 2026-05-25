import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../lib/store/ResponseStore'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('x-admin-token')
  if (auth !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }
  const csv = getStore().toCSV()
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="respuestas-budin-${Date.now()}.csv"`,
    },
  })
}
