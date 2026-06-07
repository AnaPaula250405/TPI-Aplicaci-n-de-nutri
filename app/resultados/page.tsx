'use client'
import { useRouter } from 'next/navigation'

// Esta página es pública pero los resultados son solo para admin
export default function ResultadosPublicosPage() {
  const router = useRouter()
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'var(--cream)', textAlign:'center', padding:'2rem' }}>
      <div>
        <div style={{ fontSize:'3rem', marginBottom:'1.5rem' }}>🔒</div>
        <h2 style={{ fontSize:'1.6rem', fontWeight:700, color:'var(--brand-dark)', marginBottom:'0.75rem' }}>
          Resultados privados
        </h2>
        <p style={{ color:'var(--text-mid)', maxWidth:'360px', lineHeight:1.6,
          fontFamily:'Inter,sans-serif', fontSize:'0.9rem', marginBottom:'2rem' }}>
          Los resultados son accesibles únicamente para el equipo de investigación.
        </p>
        <div style={{ display:'flex', gap:'12px', justifyContent:'center', flexWrap:'wrap' }}>
          <button className="btn-primary" onClick={() => router.push('/admin')}>Ir al panel admin</button>
          <button className="btn-secondary" onClick={() => router.push('/')}>Volver al formulario</button>
        </div>
      </div>
    </div>
  )
}
