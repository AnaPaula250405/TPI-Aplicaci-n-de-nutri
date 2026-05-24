import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Budín Orgánico · Evaluación Sensorial',
  description: 'Formulario de evaluación sensorial para el budín de zanahoria, lenteja turca y banana.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
