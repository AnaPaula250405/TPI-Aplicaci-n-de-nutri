'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import AgradoSlider from '../components/form/AgradoSlider'
import { SURVEY_QUESTIONS } from '../lib/patterns/Factory'

const MEJORIA_OPTIONS = ['textura','sabor','dulzor','humedad','aroma','color','otro']
const MEJORIA_LABELS: Record<string,string> = {
  textura:'Textura', sabor:'Sabor', dulzor:'Dulzor',
  humedad:'Humedad', aroma:'Aroma', color:'Color', otro:'Otro',
}

const SECTIONS = ['Datos personales','Intención de consumo','Opinión personal','Perfil sensorial']
const TOTAL_SECTIONS = SECTIONS.length

function getSessionToken(): string {
  if (typeof window === 'undefined') return ''
  let token = sessionStorage.getItem('survey_token')
  if (!token) {
    token = `sess_${Date.now()}_${Math.random().toString(36).substr(2,8)}`
    sessionStorage.setItem('survey_token', token)
  }
  return token
}

// ── Componente: escala visual dinámica ──────────────────────
interface VisualScaleProps {
  options: { value: string; label: string; emoji?: string; color?: string }[]
  selected: string
  onSelect: (v: string) => void
}

function VisualScale({ options, selected, onSelect }: VisualScaleProps) {
  return (
    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      {options.map((opt, i) => {
        const isSelected = selected === opt.value
        const pct = ((i) / (options.length - 1)) * 100
        const bg = isSelected
          ? `hsl(${30 - (pct * 0.2)}, ${70 + pct * 0.3}%, ${isSelected ? 45 : 92}%)`
          : '#fff9f2'
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            style={{
              flex: '1', minWidth: '70px',
              padding: '14px 8px',
              border: isSelected ? '2px solid transparent' : '2px solid #ecdcc4',
              borderRadius: '16px',
              cursor: 'pointer',
              background: isSelected
                ? `linear-gradient(135deg, hsl(${35 - i*5}, 85%, 48%), hsl(${25 - i*5}, 75%, 42%))`
                : '#fff9f2',
              color: isSelected ? 'white' : 'var(--text-dark)',
              fontWeight: isSelected ? 700 : 500,
              fontSize: '0.82rem',
              fontFamily: 'Inter, sans-serif',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              transform: isSelected ? 'translateY(-3px) scale(1.04)' : 'none',
              boxShadow: isSelected ? '0 6px 18px rgba(212,106,26,0.35)' : '0 1px 4px rgba(0,0,0,0.05)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
            }}
          >
            {opt.emoji && <span style={{ fontSize: '1.5rem' }}>{opt.emoji}</span>}
            <span>{opt.label}</span>
          </button>
        )
      })}
    </div>
  )
}

// ── Componente: escala de humedad con barra visual ──────────
function HumedadScale({ selected, onSelect }: { selected: string; onSelect: (v: string) => void }) {
  const options = [
    { value: 'muy_seco', label: 'Muy seco', emoji: '🏜️', fill: 10 },
    { value: 'seco',     label: 'Seco',     emoji: '🌵', fill: 30 },
    { value: 'adecuado', label: 'Adecuado', emoji: '✅', fill: 55 },
    { value: 'humedo',   label: 'Húmedo',   emoji: '💧', fill: 78 },
    { value: 'muy_humedo', label: 'Muy húmedo', emoji: '🌊', fill: 100 },
  ]
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Barra visual de humedad */}
      <div style={{ height: '12px', borderRadius: '99px', overflow: 'hidden',
        background: 'linear-gradient(to right, #f5d5a0, #a8d8ea)',
        marginBottom: '4px', position: 'relative' }}>
        {selected && (
          <div style={{
            position: 'absolute', top: 0, left: 0, height: '100%',
            width: `${options.find(o => o.value === selected)?.fill || 0}%`,
            background: 'linear-gradient(to right, #d4851a, #4aa8d8)',
            borderRadius: '99px', transition: 'width 0.4s ease',
          }}/>
        )}
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {options.map(opt => {
          const isSelected = selected === opt.value
          return (
            <button key={opt.value} onClick={() => onSelect(opt.value)}
              style={{
                flex: '1', minWidth: '65px', padding: '12px 6px',
                border: isSelected ? '2px solid #4aa8d8' : '2px solid #ecdcc4',
                borderRadius: '14px', cursor: 'pointer',
                background: isSelected ? 'linear-gradient(135deg, #4aa8d8, #2980b9)' : '#fff9f2',
                color: isSelected ? 'white' : 'var(--text-dark)',
                fontWeight: isSelected ? 700 : 500, fontSize: '0.78rem',
                fontFamily: 'Inter, sans-serif', textAlign: 'center',
                transition: 'all 0.2s', transform: isSelected ? 'translateY(-2px)' : 'none',
                boxShadow: isSelected ? '0 4px 14px rgba(74,168,216,0.4)' : 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
              }}>
              <span style={{ fontSize: '1.4rem' }}>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [view, setView] = useState<'landing' | 'form' | 'success'>('landing')
  const [currentSection, setCurrentSection] = useState(0)

  const [genero, setGenero] = useState('')
  const [consumiriaNuevamente, setConsumiriaNuevamente] = useState('')
  const [compraria, setCompraria] = useState('')
  const [mejoraria, setMejoraria] = useState<string[]>([])
  const [mejoriaOtro, setMejoriaOtro] = useState('')
  const [nivelAgrado, setNivelAgrado] = useState(50)
  const [saborPredominante, setSaborPredominante] = useState('')
  const [dulzor, setDulzor] = useState('')
  const [humedad, setHumedad] = useState('')
  const [color, setColor] = useState('')
  const [crujiente, setCrujiente] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState<{msg: string; type: string} | null>(null)
  const [sessionToken, setSessionToken] = useState('')

  useEffect(() => { setSessionToken(getSessionToken()) }, [])

  const showToast = (msg: string, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  const toggleMejoria = (val: string) => {
    setMejoraria(prev => prev.includes(val) ? prev.filter(v => v !== val) : [...prev, val])
  }

  const canAdvance = () => {
    if (currentSection === 0) return !!genero
    if (currentSection === 1) return !!consumiriaNuevamente && !!compraria
    if (currentSection === 2) return true
    if (currentSection === 3) return !!saborPredominante && !!dulzor && !!humedad && !!color && !!crujiente
    return true
  }

  const handleNext = () => {
    if (!canAdvance()) { showToast('Completá todas las preguntas de esta sección.'); return }
    if (currentSection < TOTAL_SECTIONS - 1) setCurrentSection(s => s + 1)
    else handleSubmit()
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          genero, consumiriaNuevamente, compraria,
          mejoraria, mejoriaOtro, nivelAgrado,
          saborPredominante, dulzor, humedad, color, crujiente,
          sessionToken,
        }),
      })
      if (res.status === 409) { showToast('Ya enviaste una respuesta en esta sesión.', 'error'); return }
      if (res.ok) { setView('success') }
      else { showToast('Hubo un error. Intentá de nuevo.') }
    } catch { showToast('Error de conexión.') }
    finally { setLoading(false) }
  }

  // ── Fondo con patrón ──────────────────────────────────────
  const formBg = {
    backgroundImage: "url('/patron.jpg')",
    backgroundRepeat: 'repeat',
    backgroundSize: '420px',
    backgroundAttachment: 'fixed',
  }

  // ── LANDING ───────────────────────────────────────────────
  if (view === 'landing') {
    return (
      <div className="hero">
        <div className="hero-bg" style={{ backgroundImage: "url('/budin.jpg')" }} />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-tag">✦ Nutrición · Evaluación Sensorial</div>
          <h1 className="hero-title">
            ¡Puntuá el <span>budín</span><br />con nosotros!
          </h1>
          <p className="hero-subtitle">
            Tu opinión es clave para mejorar este producto orgánico.<br />
            Solo toma 3 minutos completar la evaluación.
          </p>
          <div className="hero-ingredients">
            <span className="ingredient-chip">🥕 Zanahoria</span>
            <span className="ingredient-chip">🍌 Banana</span>
            <span className="ingredient-chip">🌿 Lenteja Turca</span>
          </div>
          <button className="btn-hero" onClick={() => setView('form')}>
            Comenzar evaluación
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          <div style={{ marginTop: '2.5rem', opacity: 0.5, fontSize: '0.75rem', letterSpacing: '0.1em' }}>
            ALTO EN FIBRA · ALTO EN PROTEÍNA · 100% ORGÁNICO
          </div>
        </div>
        <button onClick={() => router.push('/admin')} style={{
          position: 'absolute', bottom: '1.5rem', right: '1.5rem',
          background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)', color: 'rgba(255,255,255,0.7)',
          padding: '6px 14px', borderRadius: '99px', fontSize: '0.72rem',
          cursor: 'pointer', fontFamily: 'Inter, sans-serif',
        }}>Admin ↗</button>
      </div>
    )
  }

  // ── ÉXITO ─────────────────────────────────────────────────
  if (view === 'success') {
    return (
      <div className="success-screen">
        <div>
          <div className="success-icon">✓</div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '0.75rem' }}>
            ¡Gracias por tu evaluación!
          </h2>
          <p style={{ color: 'var(--text-mid)', marginBottom: '2rem', maxWidth: '360px', lineHeight: 1.6 }}>
            Tu respuesta fue registrada correctamente y nos ayudará a mejorar el budín orgánico.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={() => {
              setView('landing'); setCurrentSection(0)
              setGenero(''); setConsumiriaNuevamente(''); setCompraria('')
              setMejoraria([]); setNivelAgrado(50); setSaborPredominante('')
              setDulzor(''); setHumedad(''); setColor(''); setCrujiente('')
              sessionStorage.removeItem('survey_token')
              setSessionToken(getSessionToken())
            }}>Nueva evaluación</button>
            <button className="btn-secondary" onClick={() => setView('landing')}>Volver al inicio</button>
          </div>
        </div>
      </div>
    )
  }

  // ── FORMULARIO ────────────────────────────────────────────
  const progress = ((currentSection) / TOTAL_SECTIONS) * 100

  return (
    <div style={{ minHeight: '100vh', ...formBg }}>
      {/* Overlay suave sobre el patrón */}
      <div style={{ minHeight: '100vh', background: 'rgba(253,248,242,0.88)' }}>

        {/* Header con progreso */}
        <div className="form-header">
          <div className="form-header-content">
            <button onClick={() => currentSection === 0 ? setView('landing') : setCurrentSection(s => s - 1)}
              style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)',
                color: 'white', borderRadius: '99px', padding: '6px 14px', cursor: 'pointer',
                fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
              ← Atrás
            </button>
            <p style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase',
              opacity: 0.75, marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>
              Paso {currentSection + 1} de {TOTAL_SECTIONS}
            </p>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{SECTIONS[currentSection]}</h1>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${progress + (100/TOTAL_SECTIONS)}%` }} />
            </div>
          </div>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 6rem' }}>

          {/* ── Sección 0: Datos personales ── */}
          {currentSection === 0 && (
            <div className="section-card">
              <span className="section-badge">Datos personales</span>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1.2rem' }}>
                {SURVEY_QUESTIONS.genero.title}
              </h2>
              {SURVEY_QUESTIONS.genero.options?.map(opt => (
                <div key={opt.value} className={`option-item ${genero === opt.value ? 'selected' : ''}`}
                  onClick={() => setGenero(opt.value)}>
                  <span className="option-indicator">
                    {genero === opt.value && <span className="option-dot" />}
                  </span>
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {/* ── Sección 1: Intención de consumo ── */}
          {currentSection === 1 && (
            <div className="section-card">
              <span className="section-badge">Intención de consumo</span>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1.2rem' }}>
                {SURVEY_QUESTIONS.consumiriaNuevamente.title}
              </h2>
              {SURVEY_QUESTIONS.consumiriaNuevamente.options?.map(opt => (
                <div key={opt.value} className={`option-item ${consumiriaNuevamente === opt.value ? 'selected' : ''}`}
                  onClick={() => setConsumiriaNuevamente(opt.value)}>
                  <span className="option-indicator">
                    {consumiriaNuevamente === opt.value && <span className="option-dot" />}
                  </span>
                  {opt.label}
                </div>
              ))}
              <div style={{ height: '1px', background: '#ecdcc4', margin: '1.5rem 0' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1.2rem' }}>
                {SURVEY_QUESTIONS.compraria.title}
              </h2>
              {SURVEY_QUESTIONS.compraria.options?.map(opt => (
                <div key={opt.value} className={`option-item ${compraria === opt.value ? 'selected' : ''}`}
                  onClick={() => setCompraria(opt.value)}>
                  <span className="option-indicator">
                    {compraria === opt.value && <span className="option-dot" />}
                  </span>
                  {opt.label}
                </div>
              ))}
            </div>
          )}

          {/* ── Sección 2: Opinión personal ── */}
          {currentSection === 2 && (
            <div className="section-card">
              <span className="section-badge">Opinión personal</span>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1.2rem' }}>
                {SURVEY_QUESTIONS.mejoraria.title}
              </h2>
              {MEJORIA_OPTIONS.map(val => (
                <div key={val} className={`option-item ${mejoraria.includes(val) ? 'selected' : ''}`}
                  onClick={() => toggleMejoria(val)}>
                  <span className="checkbox-indicator">
                    {mejoraria.includes(val) && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    )}
                  </span>
                  {MEJORIA_LABELS[val]}
                </div>
              ))}
              {mejoraria.includes('otro') && (
                <input type="text" placeholder="Especificá qué mejorarías..."
                  value={mejoriaOtro} onChange={e => setMejoriaOtro(e.target.value)}
                  className="admin-input" style={{ marginTop: '8px' }} />
              )}
              <div style={{ height: '1px', background: '#ecdcc4', margin: '1.5rem 0' }} />
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1rem' }}>
                Nivel de agrado general
              </h2>
              <AgradoSlider value={nivelAgrado} onChange={setNivelAgrado} />
            </div>
          )}

          {/* ── Sección 3: Perfil sensorial ── */}
          {currentSection === 3 && (
            <>
              <div className="section-card">
                <span className="section-badge">Perfil sensorial</span>

                {/* Sabor predominante */}
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1.2rem' }}>
                  {SURVEY_QUESTIONS.saborPredominante.title}
                </h2>
                {SURVEY_QUESTIONS.saborPredominante.options?.map(opt => (
                  <div key={opt.value} className={`option-item ${saborPredominante === opt.value ? 'selected' : ''}`}
                    onClick={() => setSaborPredominante(opt.value)}>
                    <span className="option-indicator">
                      {saborPredominante === opt.value && <span className="option-dot" />}
                    </span>
                    {opt.label}
                  </div>
                ))}
              </div>

              {/* Dulzor — escala visual dinámica */}
              <div className="section-card">
                <span className="section-badge">Perfil sensorial</span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1rem' }}>
                  🍬 Nivel de dulzor
                </h2>
                <VisualScale
                  selected={dulzor}
                  onSelect={setDulzor}
                  options={[
                    { value: 'bajo',     label: 'Bajo',     emoji: '😐' },
                    { value: 'medio',    label: 'Medio',    emoji: '🙂' },
                    { value: 'alto',     label: 'Alto',     emoji: '😊' },
                    { value: 'muy_alto', label: 'Muy alto', emoji: '🤩' },
                  ]}
                />
              </div>

              {/* Humedad — barra dinámica */}
              <div className="section-card">
                <span className="section-badge">Perfil sensorial</span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1rem' }}>
                  💧 Nivel de humedad
                </h2>
                <HumedadScale selected={humedad} onSelect={setHumedad} />
              </div>

              {/* Crujiente — nuevo */}
              <div className="section-card">
                <span className="section-badge">Perfil sensorial</span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1rem' }}>
                  🥨 Nivel de crujiente
                </h2>
                <VisualScale
                  selected={crujiente}
                  onSelect={setCrujiente}
                  options={[
                    { value: 'nada',  label: 'Nada',  emoji: '🫠' },
                    { value: 'poco',  label: 'Poco',  emoji: '😌' },
                    { value: 'mucho', label: 'Mucho', emoji: '🥨' },
                  ]}
                />
              </div>

              {/* Color con emojis */}
              <div className="section-card">
                <span className="section-badge">Perfil sensorial</span>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-dark)', marginBottom: '1rem' }}>
                  🎨 Apreciación del color
                </h2>
                <VisualScale
                  selected={color}
                  onSelect={setColor}
                  options={[
                    { value: 'desagradable',   label: 'Desagradable',   emoji: '🤢' },
                    { value: 'poco_agradable', label: 'Poco agradable', emoji: '😑' },
                    { value: 'agradable',      label: 'Agradable',      emoji: '😍' },
                  ]}
                />
              </div>
            </>
          )}

          {/* Botón siguiente / enviar */}
          <div style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
            <button className="btn-primary" onClick={handleNext} disabled={loading}
              style={{ minWidth: '220px' }}>
              {loading ? 'Enviando...' : currentSection < TOTAL_SECTIONS - 1 ? 'Continuar →' : '✓ Enviar evaluación'}
            </button>
          </div>
        </div>

        {toast && <div className={`toast ${toast.type}`}>{toast.msg}</div>}
      </div>
    </div>
  )
}
