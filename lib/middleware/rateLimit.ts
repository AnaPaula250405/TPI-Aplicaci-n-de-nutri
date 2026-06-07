// Rate limiting: limita cuántas veces puede llamar a la API una misma IP
// Esto evita que alguien sature el servidor enviando miles de respuestas
const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const max = parseInt(process.env.RATE_LIMIT_MAX || '50')
  const now = Date.now()
  const windowMs = 60 * 1000 // ventana de 1 minuto

  const entry = requestCounts.get(ip)

  // Si no hay registro o ya pasó el minuto, reiniciamos el contador
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1 }
  }

  entry.count++
  if (entry.count > max) return { allowed: false, remaining: 0 }
  return { allowed: true, remaining: max - entry.count }
}
