// Conexión a la base de datos Neon (PostgreSQL en la nube)
import { neon } from '@neondatabase/serverless'

// Devuelve la conexión a la base de datos
export function getDb() {
  const url = process.env.DATABASE_URL || process.env.STORAGE_URL || process.env.POSTGRES_URL
  if (!url) throw new Error('No hay URL de base de datos configurada')
  return neon(url)
}

// Crea la tabla si no existe todavía
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
      crujiente TEXT NOT NULL DEFAULT 'nada',
      precio_pagar INTEGER NOT NULL DEFAULT 0
    )
  `
  // Agrega columnas nuevas si la tabla ya existía
  try { await sql`ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS crujiente TEXT NOT NULL DEFAULT 'nada'` } catch {}
  try { await sql`ALTER TABLE survey_responses ADD COLUMN IF NOT EXISTS precio_pagar INTEGER NOT NULL DEFAULT 0` } catch {}
}
