// API para que el admin inicie sesión con contraseña
import { NextRequest, NextResponse } from 'next/server'
import { getStore } from '../../../lib/store/ResponseStore'

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (password === process.env.ADMIN_PASSWORD) {
    getStore().log('INFO', 'API/admin', 'Login exitoso')
    return NextResponse.json({ ok: true, token: process.env.ADMIN_PASSWORD })
  }

  getStore().log('WARN', 'API/admin', 'Contraseña incorrecta')
  return NextResponse.json({ ok: false, error: 'Contraseña incorrecta' }, { status: 401 })
}
