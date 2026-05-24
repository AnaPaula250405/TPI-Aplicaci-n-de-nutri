'use client'
import { useEffect, useRef } from 'react'

interface AgradoSliderProps {
  value: number
  onChange: (val: number) => void
}

const LABELS = [
  { pos: 0,   label: 'No me gusta' },
  { pos: 50,  label: 'Ni me gusta\nni me disgusta' },
  { pos: 100, label: 'Me gusta' },
]

export default function AgradoSlider({ value, onChange }: AgradoSliderProps) {
  const sliderRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.setProperty('--val', `${value}%`)
    }
  }, [value])

  const getColor = () => {
    if (value < 33) return '#c45a14'
    if (value < 66) return '#e07020'
    return '#5a8a2c'
  }

  const getLabel = () => {
    if (value < 20)  return 'No me gusta'
    if (value < 40)  return 'No me gusta mucho'
    if (value < 60)  return 'Ni me gusta ni me disgusta'
    if (value < 80)  return 'Me gusta'
    return 'Me gusta mucho'
  }

  return (
    <div className="py-2">
      {/* Barra slider */}
      <input
        ref={sliderRef}
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="agrado-slider"
        style={{ '--val': `${value}%` } as React.CSSProperties}
      />

      {/* Etiquetas de posición */}
      <div className="flex justify-between mt-1 text-xs text-amber-700 font-semibold px-1">
        <span>No me gusta</span>
        <span className="text-center">Ni me gusta<br />ni me disgusta</span>
        <span>Me gusta</span>
      </div>

      {/* Indicador actual */}
      <div
        className="mt-3 text-center text-sm font-bold py-2 px-4 rounded-full inline-block w-full transition-all"
        style={{ background: getColor() + '22', color: getColor(), border: `1.5px solid ${getColor()}44` }}
      >
        {getLabel()}
      </div>
    </div>
  )
}
