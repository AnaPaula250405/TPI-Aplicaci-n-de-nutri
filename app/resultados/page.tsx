'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts'
import type { ResultsSummary } from '../../lib/patterns/Facade'

const COLORS = ['#e07020', '#f9b366', '#9e4410', '#d4852a', '#c45a14', '#f5922e']

const LABEL_MAPS: Record<string, Record<string, string>> = {
  genero: { femenino: 'Femenino', masculino: 'Masculino', otro: 'Otro', prefiero_no_decir: 'No dice' },
  consumiriaNuevamente: { si: 'Sí', no: 'No', tal_vez: 'Tal vez' },
  compraria: { definitivamente_si: 'Definitivamente sí', quizas: 'Quizás', no: 'No' },
  mejoraria: { textura: 'Textura', sabor: 'Sabor', dulzor: 'Dulzor', humedad: 'Humedad', aroma: 'Aroma', color: 'Color', otro: 'Otro' },
  sabor: { banana: 'Banana', zanahoria: 'Zanahoria', lenteja: 'Lenteja', vainilla: 'Vainilla' },
  dulzor: { bajo: 'Bajo', medio: 'Medio', alto: 'Alto', muy_alto: 'Muy alto' },
  humedad: { muy_seco: 'Muy seco', seco: 'Seco', adecuado: 'Adecuado', humedo: 'Húmedo', muy_humedo: 'Muy húmedo' },
  color: { desagradable: 'Desagradable', poco_agradable: 'Poco agradable', agradable: 'Agradable' },
}

function applyLabels(data: { name: string; value: number; percentage: string }[], mapKey: string) {
  const map = LABEL_MAPS[mapKey] || {}
  return data.map(d => ({ ...d, name: map[d.name] || d.name }))
}

function ChartCard({ title, badge, children }: { title: string; badge: string; children: React.ReactNode }) {
  return (
    <div className="result-card mb-4">
      <span className="section-badge">{badge}</span>
      <h3 className="font-bold mb-4 text-base" style={{ color: 'var(--brand-dark)', fontFamily: 'Georgia, serif' }}>{title}</h3>
      {children}
    </div>
  )
}

function CustomBar({ data }: { data: { name: string; value: number; percentage: string }[] }) {
  if (!data.length) return <p className="text-xs text-amber-700 text-center py-4">Sin datos aún</p>
  const total = data.reduce((a, d) => a + d.value, 0)
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={d.name}>
          <div className="flex justify-between text-xs mb-1 font-medium" style={{ color: 'var(--text-mid)' }}>
            <span>{d.name}</span>
            <span>{d.value} resp. · {total ? ((d.value / total) * 100).toFixed(1) : 0}%</span>
          </div>
          <div className="w-full h-7 rounded-full overflow-hidden" style={{ background: '#f0dcc0' }}>
            <div
              className="h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
              style={{
                width: total ? `${(d.value / total) * 100}%` : '0%',
                background: `linear-gradient(90deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 1) % COLORS.length]})`,
                minWidth: d.value > 0 ? '2rem' : '0',
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ResultadosPage() {
  const router = useRouter()
  const [data, setData] = useState<ResultsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchResults = useCallback(async () => {
    try {
      const res = await fetch('/api/results')
      const json = await res.json()
      setData(json)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchResults()
    const interval = setInterval(fetchResults, 15000) // auto-refresh cada 15s
    return () => clearInterval(interval)
  }, [fetchResults])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--cream)' }}>
        <div className="text-center">
          <div className="text-4xl mb-3">🥕</div>
          <p style={{ color: 'var(--brand-dark)' }}>Cargando resultados...</p>
        </div>
      </div>
    )
  }

  const total = data?.totalResponses ?? 0

  return (
    <div className="min-h-screen" style={{ background: 'var(--cream)' }}>

      {/* Header */}
      <header style={{ background: 'linear-gradient(135deg, #7a3310 0%, #c45a14 60%, #e07020 100%)' }}
              className="text-white text-center py-10 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
             style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <p className="text-xs tracking-widest uppercase opacity-80 mb-2 ornament">Panel de resultados</p>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Georgia, Cambria, serif' }}>
          Evaluación Sensorial
        </h1>
        <p className="text-sm opacity-80 mt-2">Budín de Zanahoria, Lenteja Turca y Banana</p>
        <div className="mt-4 inline-block bg-white bg-opacity-20 rounded-full px-6 py-2 font-bold text-lg">
          {total} {total === 1 ? 'respuesta' : 'respuestas'} recibidas
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">

        {total === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--brand-dark)' }}>Aún no hay respuestas</h2>
            <p className="text-amber-700 text-sm mb-6">Compartí el formulario para comenzar a recopilar datos.</p>
            <button className="btn-primary" onClick={() => router.push('/')}>Ir al formulario →</button>
          </div>
        ) : (
          <>
            {/* ── Género ── */}
            <ChartCard title="Distribución por género" badge="Datos demográficos">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={applyLabels(data!.generoChart, 'genero')}
                       dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
                       label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                       labelLine={false}>
                    {data!.generoChart.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} respuestas`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              {/* Comparativo texto */}
              <div className="mt-3 text-xs text-center" style={{ color: 'var(--text-mid)' }}>
                {(() => {
                  const fem = data!.generoChart.find(d => d.name === 'femenino')?.value ?? 0
                  const mas = data!.generoChart.find(d => d.name === 'masculino')?.value ?? 0
                  if (fem > mas) return '💜 El producto es más popular entre mujeres'
                  if (mas > fem) return '💙 El producto es más popular entre hombres'
                  return '⚖️ Igual popularidad entre géneros'
                })()}
              </div>
            </ChartCard>

            {/* ── Intención de consumo ── */}
            <ChartCard title="¿Consumiría nuevamente?" badge="Intención de consumo">
              <CustomBar data={applyLabels(data!.consumiriaChart, 'consumiriaNuevamente')} />
            </ChartCard>

            <ChartCard title="¿Compraría el producto?" badge="Intención de consumo">
              <CustomBar data={applyLabels(data!.comprariaChart, 'compraria')} />
            </ChartCard>

            {/* ── Nivel de agrado ── */}
            <ChartCard title="Nivel de agrado general" badge="Opinión personal">
              <div className="text-center mb-4">
                <span className="text-4xl font-bold" style={{ color: 'var(--brand-primary)' }}>
                  {data!.agradoPromedio.toFixed(1)}
                </span>
                <span className="text-sm text-amber-700 ml-1">/ 100</span>
              </div>
              <div className="w-full h-10 rounded-full overflow-hidden relative" style={{ background: '#f0dcc0' }}>
                <div className="h-full rounded-full transition-all duration-1000 flex items-center justify-center text-white text-xs font-bold"
                     style={{
                       width: `${data!.agradoPromedio}%`,
                       background: `linear-gradient(90deg, #c45a14, #e07020, #f9b366)`,
                       minWidth: '2.5rem'
                     }}>
                  {data!.agradoPromedio.toFixed(0)}%
                </div>
              </div>
              <div className="flex justify-between text-xs mt-1 text-amber-700">
                <span>No me gusta</span>
                <span>Ni me gusta ni disgusta</span>
                <span>Me gusta</span>
              </div>
            </ChartCard>

            {/* ── Mejorías ── */}
            <ChartCard title="¿Qué mejorarían?" badge="Opinión personal">
              <CustomBar data={applyLabels(data!.mejorariaChart, 'mejoraria')} />
            </ChartCard>

            {/* ── Sabor predominante ── */}
            <ChartCard title="Sabor predominante" badge="Perfil sensorial">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={applyLabels(data!.saborChart, 'sabor')} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#7a3310' }} />
                  <YAxis tick={{ fontSize: 11, fill: '#7a3310' }} allowDecimals={false} />
                  <Tooltip formatter={(v) => [`${v} respuestas`]} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {data!.saborChart.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>

            {/* ── Dulzor ── */}
            <ChartCard title="Nivel de dulzor percibido" badge="Perfil sensorial">
              <CustomBar data={applyLabels(data!.dulzorChart, 'dulzor')} />
            </ChartCard>

            {/* ── Humedad ── */}
            <ChartCard title="Nivel de humedad percibida" badge="Perfil sensorial">
              <CustomBar data={applyLabels(data!.humedadChart, 'humedad')} />
            </ChartCard>

            {/* ── Color ── */}
            <ChartCard title="Apreciación del color" badge="Perfil sensorial">
              <CustomBar data={applyLabels(data!.colorChart, 'color')} />
            </ChartCard>
          </>
        )}

        <div className="text-center mt-6 space-y-2">
          <button className="btn-primary" onClick={() => router.push('/')}>
            ← Volver al formulario
          </button>
          <p className="text-xs text-amber-700 opacity-60 mt-2">
            Los resultados se actualizan automáticamente cada 15 segundos.
          </p>
        </div>
      </main>
    </div>
  )
}
