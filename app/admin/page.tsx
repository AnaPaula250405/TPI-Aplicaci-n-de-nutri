'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Página de login para el administrador
export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!password) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.ok) {
        // Guardamos el token en sessionStorage para usarlo en el dashboard
        sessionStorage.setItem('admin_token', data.token)
        router.push('/admin/dashboard')
      } else {
        setError('Contraseña incorrecta. Intentá de nuevo.')
      }
    } catch {
      setError('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-card">
        <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 1.5rem',
          background: 'linear-gradient(135deg, #d4851a, #e8834a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.8rem', boxShadow: '0 8px 24px rgba(212,106,26,0.35)' }}>
          🔐
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '0.4rem' }}>
          Panel de Administración
        </h1>
        <p style={{ color: 'var(--text-mid)', fontSize: '0.88rem', marginBottom: '2rem' }}>
          Solo para el equipo de investigación
        </p>
        <input type="password" className="admin-input" placeholder="Contraseña de acceso"
          value={password} onChange={e => { setPassword(e.target.value); }}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />
        {error && <p style={{ color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
        <button className="btn-primary" onClick={handleLogin} disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Verificando...' : 'Ingresar al panel'}
        </button>
        <button onClick={() => { router.push('/'); }}
          style={{ marginTop: '1rem', background: 'none', border: 'none',
            color: 'var(--text-mid)', fontSize: '0.82rem', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          ← Volver al formulario
        </button>
      </div>
    </div>
  )
}
