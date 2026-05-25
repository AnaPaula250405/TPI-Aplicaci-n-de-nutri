import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Budín Orgánico · Evaluación Sensorial',
  description: 'Evaluación sensorial del budín de zanahoria, lenteja turca y banana.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const env = process.env.NEXT_PUBLIC_ENV || 'qa'
  const envLabel = process.env.NEXT_PUBLIC_ENV_LABEL || 'QA'
  const envColor = process.env.NEXT_PUBLIC_ENV_COLOR || '#6366f1'

  const envNames: Record<string, string> = {
    qa: 'QA',
    beta: 'BETA',
    production: 'PROD',
  }

  return (
    <html lang="es">
      <body>
        {/* RNF visual: badge de entorno visible siempre */}
        <div
          className="env-badge"
          style={{ background: envColor }}
          title={envLabel}
        >
          {envNames[env] || env.toUpperCase()}
        </div>
        {children}
      </body>
    </html>
  )
}
