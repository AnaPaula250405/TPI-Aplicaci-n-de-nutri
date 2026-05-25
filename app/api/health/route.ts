import { NextResponse } from 'next/server'
import { getStore } from '../../../lib/store/ResponseStore'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    env: process.env.NEXT_PUBLIC_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    totalResponses: getStore().getCount(),
    uptime: process.uptime(),
  })
}
