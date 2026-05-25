/**
 * RNF #14 — Limitación de solicitudes por cliente
 */
const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const max = parseInt(process.env.RATE_LIMIT_MAX || '50')
  const now = Date.now()
  const windowMs = 60 * 1000

  const entry = requestCounts.get(ip)
  if (!entry || now > entry.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: max - 1 }
  }
  entry.count++
  if (entry.count > max) return { allowed: false, remaining: 0 }
  return { allowed: true, remaining: max - entry.count }
}
