'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AgradoSlider from '../components/form/AgradoSlider'
import { SURVEY_QUESTIONS } from '../lib/patterns/Factory'

const MEJORIA_OPTIONS = ['textura', 'sabor', 'dulzor', 'humedad', 'aroma', 'color', 'otro']
const MEJORIA_LABELS: Record<string, string> = {
  textura: 'Textura', sabor: 'Sabor', dulzor: 'Dulzor',
  humedad: 'Humedad', aroma: 'Aroma', color: 'Color', otro: 'Otro',
}

export default function HomePage() {
  const router = useRouter()

  // ── Estado del formulario ──────────────────────────────────
  const [genero, setGenero]                             = useState('')
  const [consumiriaNuevamente, setConsumiriaNuevamente] = useState('')
  const [compraria, setCompraria]                       = useState('')
  const [mejoraria, setMejoraria]                       = useState<string[]>([])
  const [mejoriaOtro, setMejoriaOtro]                   = useState('')
  const [nivelAgrado, setNivelAgrado]                   = useState(50)
  const [saborPredominante, setSaborPredominante]       = useState('')
  const [dulzor, setDulzor]                             = useState('')
  const [humedad, setHumedad]                           = useState('')
  const [color, setColor]                               = useState('')
  const [loading, setLoading]                           = useState(false)
  const [toast, setToast]                               = useState('')
  const [submitted, setSubmitted]                       = useState(false)
  // ──────────────────────────────────────────────────────────

  const toggleMejoria = (val: string) => {
    setMejoraria(prev =>
      prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val]
    )
  }

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  const handleSubmit = async () => {
    if (!genero || !consumiriaNuevamente || !compraria || !saborPredominante || !dulzor || !humedad || !color) {
      showToast('Por favor completá todas las preguntas obligatorias.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genero, consumiriaNuevamente, compraria,
          mejoraria, mejoriaOtro, nivelAgrado,
          saborPredominante, dulzor, humedad, color,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        showToast('Hubo un error. Intentá de nuevo.')
      }
    } catch {
      showToast('Error de conexión.')
    } finally {
      setLoading(false)
    }
  }

  // ── Pantalla de éxito ──────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
           style={{ background: 'var(--cream)' }}>
        <div className="text-6xl mb-4">🥕</div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
          ¡Gracias por tu respuesta!
        </h2>
        <p className="text-amber-700 mb-6 max-w-sm">
          Tu evaluación fue registrada correctamente y ayudará a mejorar el budín orgánico.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button className="btn-primary" onClick={() => setSubmitted(false)}>
            Enviar otra respuesta
          </button>
          <button
            onClick={() => router.push('/resultados')}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #7a3310, #9e4410)' }}
          >
            Ver resultados
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>

      {/* ── Header ── */}
      <header style={{ background: 'linear-gradient(135deg, #9e4410 0%, #e07020 60%, #f9b366 100%)' }}
              className="text-white text-center py-12 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <p className="text-xs tracking-widest uppercase opacity-80 mb-2 ornament">Nutrición · Evaluación Sensorial</p>
        <h1 className="text-3xl md:text-4xl font-bold mb-2" style={{ fontFamily: 'Georgia, Cambria, serif' }}>
          Budín de Zanahoria,<br />Lenteja Turca y Banana
        </h1>
        <p className="opacity-80 text-sm mt-3 max-w-md mx-auto">
          Tu opinión es fundamental para mejorar este producto orgánico.
          Completá el formulario con honestidad.
        </p>
        <div className="mt-4 flex justify-center gap-4 text-2xl">
          <span>🥕</span><span>🍌</span><span>🌿</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {/* ══════════════════════════════════════════
            SECCIÓN 0: DATOS PERSONALES
        ══════════════════════════════════════════ */}
        <div className="section-card">
          <span className="section-badge">Datos personales</span>
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            {SURVEY_QUESTIONS.genero.title}
          </h2>
          {SURVEY_QUESTIONS.genero.options?.map(opt => (
            <div key={opt.value}
                 className={`radio-option ${genero === opt.value ? 'selected' : ''}`}
                 onClick={() => setGenero(opt.value)}>
              <span className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: genero === opt.value ? 'var(--brand-primary)' : '#ccc' }}>
                {genero === opt.value && (
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                )}
              </span>
              {opt.label}
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            SECCIÓN 1: INTENCIÓN DE CONSUMO
        ══════════════════════════════════════════ */}
        <div className="section-card">
          <span className="section-badge">Intención de consumo</span>

          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            {SURVEY_QUESTIONS.consumiriaNuevamente.title}
          </h2>
          {SURVEY_QUESTIONS.consumiriaNuevamente.options?.map(opt => (
            <div key={opt.value}
                 className={`radio-option ${consumiriaNuevamente === opt.value ? 'selected' : ''}`}
                 onClick={() => setConsumiriaNuevamente(opt.value)}>
              <span className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: consumiriaNuevamente === opt.value ? 'var(--brand-primary)' : '#ccc' }}>
                {consumiriaNuevamente === opt.value && (
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                )}
              </span>
              {opt.label}
            </div>
          ))}

          <hr className="my-5" style={{ borderColor: '#f0dcc0' }} />

          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            {SURVEY_QUESTIONS.compraria.title}
          </h2>
          {SURVEY_QUESTIONS.compraria.options?.map(opt => (
            <div key={opt.value}
                 className={`radio-option ${compraria === opt.value ? 'selected' : ''}`}
                 onClick={() => setCompraria(opt.value)}>
              <span className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: compraria === opt.value ? 'var(--brand-primary)' : '#ccc' }}>
                {compraria === opt.value && (
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                )}
              </span>
              {opt.label}
            </div>
          ))}
        </div>

        {/* ══════════════════════════════════════════
            SECCIÓN 2: OPINIÓN PERSONAL
        ══════════════════════════════════════════ */}
        <div className="section-card">
          <span className="section-badge">Opinión personal</span>

          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            {SURVEY_QUESTIONS.mejoraria.title}
          </h2>
          {MEJORIA_OPTIONS.map(val => (
            <div key={val}
                 className={`checkbox-option ${mejoraria.includes(val) ? 'selected' : ''}`}
                 onClick={() => toggleMejoria(val)}>
              <span className="w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: mejoraria.includes(val) ? 'var(--brand-primary)' : '#ccc',
                             background: mejoraria.includes(val) ? 'var(--brand-primary)' : 'transparent' }}>
                {mejoraria.includes(val) && <span className="text-white text-xs">✓</span>}
              </span>
              {MEJORIA_LABELS[val]}
            </div>
          ))}
          {mejoraria.includes('otro') && (
            <input
              type="text"
              placeholder="Especificá qué mejorarías..."
              value={mejoriaOtro}
              onChange={e => setMejoriaOtro(e.target.value)}
              className="w-full mt-2 px-4 py-2 rounded-lg border-2 text-sm outline-none"
              style={{ borderColor: '#f0dcc0', background: 'var(--cream)', color: 'var(--text-dark)' }}
            />
          )}

          <hr className="my-5" style={{ borderColor: '#f0dcc0' }} />

          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            Nivel de agrado general
          </h2>
          <AgradoSlider value={nivelAgrado} onChange={setNivelAgrado} />
        </div>

        {/* ══════════════════════════════════════════
            SECCIÓN 3: PERFIL SENSORIAL
        ══════════════════════════════════════════ */}
        <div className="section-card">
          <span className="section-badge">Perfil sensorial</span>

          {/* Sabor predominante */}
          <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            {SURVEY_QUESTIONS.saborPredominante.title}
          </h2>
          {SURVEY_QUESTIONS.saborPredominante.options?.map(opt => (
            <div key={opt.value}
                 className={`radio-option ${saborPredominante === opt.value ? 'selected' : ''}`}
                 onClick={() => setSaborPredominante(opt.value)}>
              <span className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center"
                    style={{ borderColor: saborPredominante === opt.value ? 'var(--brand-primary)' : '#ccc' }}>
                {saborPredominante === opt.value && (
                  <span className="w-2 h-2 rounded-full" style={{ background: 'var(--brand-primary)' }} />
                )}
              </span>
              {opt.label}
            </div>
          ))}

          <hr className="my-5" style={{ borderColor: '#f0dcc0' }} />

          {/* Dulzor */}
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            {SURVEY_QUESTIONS.dulzor.title}
          </h2>
          <div className="flex gap-2">
            {SURVEY_QUESTIONS.dulzor.options?.map(opt => (
              <button key={opt.value}
                      className={`scale-btn ${dulzor === opt.value ? 'selected' : ''}`}
                      onClick={() => setDulzor(opt.value)}>
                {opt.label}
              </button>
            ))}
          </div>

          <hr className="my-5" style={{ borderColor: '#f0dcc0' }} />

          {/* Humedad */}
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            {SURVEY_QUESTIONS.humedad.title}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {SURVEY_QUESTIONS.humedad.options?.map(opt => (
              <button key={opt.value}
                      className={`scale-btn ${humedad === opt.value ? 'selected' : ''}`}
                      style={{ flex: '1 1 auto', minWidth: '80px' }}
                      onClick={() => setHumedad(opt.value)}>
                {opt.label}
              </button>
            ))}
          </div>

          <hr className="my-5" style={{ borderColor: '#f0dcc0' }} />

          {/* Color */}
          <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>
            {SURVEY_QUESTIONS.color.title}
          </h2>
          <div className="flex gap-2">
            {SURVEY_QUESTIONS.color.options?.map(opt => (
              <button key={opt.value}
                      className={`scale-btn ${color === opt.value ? 'selected' : ''}`}
                      onClick={() => setColor(opt.value)}>
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Botón enviar ── */}
        <div className="text-center py-4">
          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Enviando...' : '✦ Enviar evaluación ✦'}
          </button>
          <p className="text-xs text-amber-700 mt-3 opacity-70">
            Todos tus datos son anónimos y sólo se usan con fines académicos.
          </p>
        </div>
      </main>

      {/* ── Navegación a resultados ── */}
      <div className="text-center pb-8">
        <button
          onClick={() => router.push('/resultados')}
          className="text-sm underline"
          style={{ color: 'var(--brand-dark)', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          Ver resultados del estudio →
        </button>
      </div>

      {/* ── Toast notification ── */}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}
