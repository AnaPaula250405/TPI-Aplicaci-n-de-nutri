'use client'
import { useRef } from 'react'

interface AgradoSliderProps {
  value: number
  onChange: (val: number) => void
}

const getLabel = (value: number) => {
  if (value < 20)  return { text: 'No me gusta', face: '😖' }
  if (value < 40)  return { text: 'No me gusta mucho', face: '😕' }
  if (value < 60)  return { text: 'Ni me gusta ni me disgusta', face: '😐' }
  if (value < 80)  return { text: 'Me gusta', face: '😊' }
  return { text: '¡Me gusta mucho!', face: '😍' }
}

export default function AgradoSlider({ value, onChange }: AgradoSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const { text, face } = getLabel(value)

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const pct = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1)
    onChange(Math.round(pct * 100))
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.buttons !== 1) return
    handleClick(e)
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const pct = Math.min(Math.max((touch.clientX - rect.left) / rect.width, 0), 1)
    onChange(Math.round(pct * 100))
  }

  return (
    <div style={{ padding: '24px 0 8px' }}>
      <div ref={trackRef} onClick={handleClick} onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}
        style={{ position: 'relative', width: '100%', height: '12px', borderRadius: '99px',
          background: `linear-gradient(to right, #e07020 ${value}%, #ecdcc4 ${value}%)`,
          cursor: 'pointer', userSelect: 'none' }}>
        <div style={{ position: 'absolute', top: '50%', left: `${value}%`,
          transform: 'translate(-50%, -50%)', fontSize: '2rem', lineHeight: 1,
          pointerEvents: 'none', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
          transition: 'left 0.05s' }}>🥕</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px',
        fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-mid)',
        fontFamily: 'Inter, sans-serif', padding: '0 2px' }}>
        <span>No me gusta</span>
        <span style={{ textAlign: 'center' }}>Ni gusta<br/>ni disgusta</span>
        <span>Me gusta</span>
      </div>
      <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.88rem',
        fontWeight: 700, padding: '8px 16px', borderRadius: '99px',
        background: '#e0702018', color: '#c45a14', border: '1.5px solid #e0702033',
        fontFamily: 'Inter, sans-serif' }}>
        {face} {text}
      </div>
    </div>
  )
}
