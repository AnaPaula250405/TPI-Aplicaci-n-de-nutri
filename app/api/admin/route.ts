import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../lib/store/ResponseStore'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password === process.env.ADMIN_PASSWORD) {
    getStore().log('INFO', 'API/admin', 'Login admin exitoso')
    return NextResponse.json({ ok: true, token: process.env.ADMIN_PASSWORD })
  }
  getStore().log('WARN', 'API/admin', 'Intento de login fallido')
  return NextResponse.json({ ok: false, error: 'Contraseña incorrecta' }, { status: 401 })
}
