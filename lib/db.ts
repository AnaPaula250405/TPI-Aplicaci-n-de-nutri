import { neon } from '@neondatabase/serverless'

export function getDb() {
  const url = process.env.DATABASE_URL || process.env.STORAGE_URL
  if (!url) throw new Error('DATABASE_URL no configurada')
  return neon(url)
}

export async function initDb() {
  const sql = getDb()
  await sql`
    CREATE TABLE IF NOT EXISTS survey_responses (
      id TEXT PRIMARY KEY,
      timestamp TEXT NOT NULL,
      session_token TEXT UNIQUE NOT NULL,
      genero TEXT NOT NULL,
      consumiria_nuevamente TEXT NOT NULL,
      compraria TEXT NOT NULL,
      mejoraria TEXT NOT NULL,
      mejoria_otro TEXT,
      nivel_agrado INTEGER NOT NULL,
      sabor_predominante TEXT NOT NULL,
      dulzor TEXT NOT NULL,
      humedad TEXT NOT NULL,
      color TEXT NOT NULL,
      crujiente TEXT NOT NULL DEFAULT 'nada'
    )
  `
  // Agregar columna si no existe (para bases de datos ya creadas)
  try {
    await sql`ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS crujiente TEXT NOT NULL DEFAULT 'nada'`
  } catch {}
}
