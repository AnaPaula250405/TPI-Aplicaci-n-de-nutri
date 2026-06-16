'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import type { ResultsSummary } from '../../../lib/patterns/Facade'

const COLORS = ['#d4851a','#e8834a','#8b3e0f','#f0a050','#b86020','#f5c07a']

// Traducciones para mostrar en los gráficos
const LABELS: Record<string, Record<string, string>> = {
  genero: { femenino:'Femenino', masculino:'Masculino', otro:'Otro', prefiero_no_decir:'No dice' },
  consumiriaNuevamente: { si:'Sí', no:'No', tal_vez:'Tal vez' },
  compraria: { definitivamente_si:'Definitivamente sí', quizas:'Quizás', no:'No' },
  mejoraria: { textura:'Textura', sabor:'Sabor', dulzor:'Dulzor', humedad:'Humedad', aroma:'Aroma', color:'Color', otro:'Otro' },
  sabor: { banana:'Banana', zanahoria:'Zanahoria', lenteja:'Lenteja', vainilla:'Vainilla' },
  dulzor: { bajo:'Bajo', medio:'Medio', alto:'Alto', muy_alto:'Muy alto' },
  humedad: { muy_seco:'Muy seco', seco:'Seco', adecuado:'Adecuado', humedo:'Húmedo', muy_humedo:'Muy húmedo' },
  color: { desagradable:'Desagradable', poco_agradable:'Poco agradable', agradable:'Agradable' },
  crujiente: { nada:'Nada', poco:'Poco', mucho:'Mucho' },
}

function applyLabels(data: {name:string;value:number;percentage:string}[], key: string) {
  return data.map(d => ({ ...d, name: LABELS[key]?.[d.name] || d.name }))
}

// Componente para mostrar barras horizontales con porcentajes
function HorizBar({ data }: { data: {name:string;value:number;percentage:string}[] }) {
  if (!data.length) return <p style={{ textAlign:'center', color:'var(--text-mid)', fontSize:'0.85rem', padding:'1rem' }}>Sin datos aún</p>
  const total = data.reduce((a,d) => a+d.value, 0)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
      {data.map((d,i) => (
        <div key={d.name}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.82rem',
            fontWeight:500, color:'var(--text-mid)', marginBottom:'4px', fontFamily:'Inter,sans-serif' }}>
            <span>{d.name}</span>
            <span>{d.value} resp. · {total ? ((d.value/total)*100).toFixed(1) : 0}%</span>
          </div>
          <div style={{ height:'28px', borderRadius:'99px', overflow:'hidden', background:'#f0e6d3' }}>
            <div style={{
              height:'100%', borderRadius:'99px',
              width: total ? `${(d.value/total)*100}%` : '0%',
              background: `linear-gradient(90deg, ${COLORS[i%COLORS.length]}, ${COLORS[(i+1)%COLORS.length]})`,
              minWidth: d.value > 0 ? '2rem' : '0', transition: 'width 0.8s ease',
            }}/>
          </div>
        </div>
      ))}
    </div>
  )
}

// Tarjeta para cada gráfico
function ResultCard({ title, badge, children }: { title:string; badge:string; children:React.ReactNode }) {
  return (
    <div className="result-card">
      <span className="section-badge">{badge}</span>
      <h3 style={{ fontWeight:700, marginBottom:'1rem', fontSize:'1rem', color:'var(--brand-dark)' }}>{title}</h3>
      {children}
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<ResultsSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState('')

  useEffect(() => {
  const t = sessionStorage.getItem('admin_token') || ''
  if (!t) { router.push('/admin'); return }
  setToken(t)

  const doFetch = async () => {
    try {
      const res = await fetch('/api/results', { headers: { 'x-admin-token': t } })
      if (res.status === 401) { router.push('/admin'); return }
      setData(await res.json())
    } catch(e) { console.error(e) }
    finally { setLoading(false) }
  }

  doFetch()
  const interval = setInterval(doFetch, 15000)
  return () => { clearInterval(interval); }
}, [router])

  // Descargar CSV
  const handleExport = async () => {
    const res = await fetch('/api/export', { headers: { 'x-admin-token': token } })
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `respuestas-budin-${Date.now()}.csv`
    a.click()
  }

  const handleLogout = () => {
    sessionStorage.removeItem('admin_token')
    router.push('/admin')
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'var(--cream)' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🥕</div>
        <p style={{ color:'var(--brand-dark)', fontFamily:'Inter,sans-serif' }}>Cargando resultados...</p>
      </div>
    </div>
  )

  const total = data?.totalResponses ?? 0

  return (
    <div style={{ minHeight:'100vh', background:'var(--cream)' }}>
      {/* Header del panel */}
      <div style={{ background:'linear-gradient(135deg, #1a0e06, #5c2710)', color:'white',
        padding:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <p style={{ fontSize:'0.7rem', letterSpacing:'0.15em', textTransform:'uppercase',
            opacity:0.7, fontFamily:'Inter,sans-serif', marginBottom:'4px' }}>Panel de administración</p>
          <h1 style={{ fontSize:'1.4rem', fontWeight:700 }}>Evaluación Sensorial</h1>
        </div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          <button onClick={handleExport}
            style={{ background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.3)',
              color:'white', padding:'8px 18px', borderRadius:'99px', cursor:'pointer',
              fontSize:'0.82rem', fontFamily:'Inter,sans-serif', fontWeight:600 }}>
            ↓ Exportar CSV
          </button>
          <button onClick={handleLogout}
            style={{ background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)',
              color:'rgba(255,255,255,0.7)', padding:'8px 18px', borderRadius:'99px', cursor:'pointer',
              fontSize:'0.82rem', fontFamily:'Inter,sans-serif' }}>
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Total de respuestas */}
      <div style={{ background:'linear-gradient(135deg, #8b3e0f, #d4851a)', padding:'2rem', textAlign:'center', color:'white' }}>
        <div style={{ fontSize:'3.5rem', fontWeight:900, fontFamily:'Playfair Display,serif' }}>{total}</div>
        <p style={{ opacity:0.85, fontFamily:'Inter,sans-serif', fontSize:'0.9rem' }}>
          {total === 1 ? 'respuesta recibida' : 'respuestas recibidas'}
        </p>
        <p style={{ opacity:0.55, fontSize:'0.72rem', marginTop:'6px', fontFamily:'Inter,sans-serif' }}>
          Se actualiza automáticamente cada 15 segundos
        </p>
      </div>

      <div style={{ maxWidth:'700px', margin:'0 auto', padding:'1.5rem 1rem 4rem' }}>
        {total === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
            <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>📋</div>
            <h2 style={{ color:'var(--brand-dark)', marginBottom:'0.5rem' }}>Aún no hay respuestas</h2>
            <p style={{ color:'var(--text-mid)', fontSize:'0.9rem' }}>Compartí el formulario con los evaluadores.</p>
          </div>
        ) : (
          <>
            <ResultCard title="Distribución por género" badge="Datos demográficos">
              <div style={{ display:'flex', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
                {/* Gráfico de torta sin etiquetas */}
                <div style={{ flex:'0 0 160px' }}>
                  <ResponsiveContainer width={160} height={160}>
                    <PieChart>
                      <Pie data={applyLabels(data?.generoChart,'genero')}
                        dataKey="value" nameKey="name"
                        cx="50%" cy="50%" outerRadius={70} innerRadius={30}
                        label={false} labelLine={false}>
                        {data?.generoChart.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                      </Pie>
                      <Tooltip formatter={(v, name) => [`${v} respuestas`, name]}/>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Lista de etiquetas al costado */}
                <div style={{ flex:1, display:'flex', flexDirection:'column', gap:'10px' }}>
                  {(() => {
                    const total = data?.generoChart.reduce((a,x) => a+x.value, 0)
                    return applyLabels(data?.generoChart,'genero').map((d,i) => (
                      <div key={d.name} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                        <span style={{ width:14, height:14, borderRadius:'3px', flexShrink:0,
                          background:COLORS[i%COLORS.length], display:'inline-block' }}/>
                        <span style={{ fontSize:'0.88rem', fontFamily:'Inter,sans-serif',
                          color:'var(--text-dark)', fontWeight:500, flex:1 }}>{d.name}</span>
                        <span style={{ fontSize:'0.88rem', fontFamily:'Inter,sans-serif',
                          color:'var(--text-mid)', fontWeight:700 }}>
                          {total ? ((d.value/total)*100).toFixed(0) : 0}%
                        </span>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </ResultCard>

            <ResultCard title="¿Consumiría nuevamente?" badge="Intención de consumo">
              <HorizBar data={applyLabels(data?.consumiriaChart,'consumiriaNuevamente')}/>
            </ResultCard>

            <ResultCard title="¿Compraría el producto?" badge="Intención de consumo">
              <HorizBar data={applyLabels(data?.comprariaChart,'compraria')}/>
            </ResultCard>

            {/* Precio promedio */}
            <ResultCard title="Precio dispuesto a pagar" badge="Intención de consumo">
              <div style={{ textAlign:'center' }}>
                <span style={{ fontSize:'3rem', fontWeight:900, color:'var(--brand-primary)', fontFamily:'Playfair Display,serif' }}>
                  ${data?.precioPromedio?.toFixed(0) || 0}
                </span>
                <p style={{ color:'var(--text-mid)', fontSize:'0.85rem', fontFamily:'Inter,sans-serif', marginTop:'4px' }}>
                  promedio en pesos argentinos
                </p>
              </div>
            </ResultCard>

            <ResultCard title="Nivel de agrado general" badge="Opinión personal">
              <div style={{ textAlign:'center', marginBottom:'1rem' }}>
                <span style={{ fontSize:'3rem', fontWeight:900, color:'var(--brand-primary)', fontFamily:'Playfair Display,serif' }}>
                  {data?.agradoPromedio.toFixed(1)}
                </span>
                <span style={{ color:'var(--text-mid)', fontFamily:'Inter,sans-serif' }}> / 100</span>
              </div>
              <div style={{ height:'14px', borderRadius:'99px', overflow:'hidden', background:'#f0e6d3', marginBottom:'8px' }}>
                <div style={{ height:'100%', borderRadius:'99px', transition:'width 1s ease',
                  width:`${data?.agradoPromedio}%`,
                  background:'linear-gradient(90deg, #8b3e0f, #d4851a, #f0a050)', minWidth:'2rem' }}/>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'var(--text-mid)', fontFamily:'Inter,sans-serif' }}>
                <span>No me gusta</span><span>Ni gusta ni disgusta</span><span>Me gusta</span>
              </div>
            </ResultCard>

            <ResultCard title="¿Qué mejorarían?" badge="Opinión personal">
              <HorizBar data={applyLabels(data?.mejorariaChart,'mejoraria')}/>
            </ResultCard>

            <ResultCard title="Sabor predominante" badge="Perfil sensorial">
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={applyLabels(data?.saborChart,'sabor')} margin={{top:5,right:10,left:-20,bottom:5}}>
                  <XAxis dataKey="name" tick={{fontSize:11, fill:'#6b3a1a', fontFamily:'Inter,sans-serif'}}/>
                  <YAxis tick={{fontSize:11, fill:'#6b3a1a'}} allowDecimals={false}/>
                  <Tooltip formatter={v=>[`${v} respuestas`]}/>
                  <Bar dataKey="value" radius={[8,8,0,0]}>
                    {data?.saborChart.map((_,i)=><Cell key={i} fill={COLORS[i%COLORS.length]}/>)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ResultCard>

            <ResultCard title="Nivel de dulzor" badge="Perfil sensorial">
              <HorizBar data={applyLabels(data?.dulzorChart,'dulzor')}/>
            </ResultCard>

            <ResultCard title="Nivel de humedad" badge="Perfil sensorial">
              <HorizBar data={applyLabels(data?.humedadChart,'humedad')}/>
            </ResultCard>

            <ResultCard title="Nivel de crujiente" badge="Perfil sensorial">
              <HorizBar data={applyLabels(data?.crujienteChart, 'crujiente')}/>
            </ResultCard>

            <ResultCard title="Apreciación del color" badge="Perfil sensorial">
              <HorizBar data={applyLabels(data?.colorChart,'color')}/>
            </ResultCard>
          </>
        )}
      </div>
    </div>
  )
}
