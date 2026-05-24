/**
 * ============================================================
 * PATRÓN 4: STRATEGY
 * ============================================================
 * Define una familia de algoritmos (estrategias de análisis
 * de datos), los encapsula y los hace intercambiables.
 * Cada pregunta puede usar una estrategia distinta para
 * procesar y presentar sus resultados.
 * ============================================================
 */

import { SurveyResponse } from '../store/ResponseStore'

// ── Interfaz Strategy ────────────────────────────────────────
export interface ChartDataStrategy {
  buildChartData(responses: SurveyResponse[], field: keyof SurveyResponse): ChartDataPoint[]
}

export interface ChartDataPoint {
  name: string
  value: number
  percentage: string
}
// ────────────────────────────────────────────────────────────

// ── Estrategia: conteo simple de opciones ───────────────────
export class CountStrategy implements ChartDataStrategy {
  buildChartData(responses: SurveyResponse[], field: keyof SurveyResponse): ChartDataPoint[] {
    const counts: Record<string, number> = {}
    responses.forEach(r => {
      const val = String(r[field])
      counts[val] = (counts[val] || 0) + 1
    })
    const total = responses.length || 1
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / total) * 100).toFixed(1) + '%',
    }))
  }
}
// ────────────────────────────────────────────────────────────

// ── Estrategia: promedio para campos numéricos (slider) ──────
export class AverageStrategy implements ChartDataStrategy {
  buildChartData(responses: SurveyResponse[], field: keyof SurveyResponse): ChartDataPoint[] {
    if (responses.length === 0) return []
    const sum = responses.reduce((acc, r) => acc + (Number(r[field]) || 0), 0)
    const avg = sum / responses.length
    return [
      { name: 'No me gusta', value: Math.max(0, 33 - avg / 3), percentage: '' },
      { name: 'Ni gusta ni disgusta', value: 33, percentage: '' },
      { name: 'Me gusta', value: Math.min(100, avg), percentage: avg.toFixed(1) + ' / 100' },
    ]
  }
}
// ────────────────────────────────────────────────────────────

// ── Estrategia: distribución por género ─────────────────────
export class GenderDistributionStrategy implements ChartDataStrategy {
  buildChartData(responses: SurveyResponse[], _field: keyof SurveyResponse): ChartDataPoint[] {
    const labels: Record<string, string> = {
      femenino: 'Femenino',
      masculino: 'Masculino',
      otro: 'Otro',
      prefiero_no_decir: 'Prefiero no decirlo',
    }
    const counts: Record<string, number> = {}
    responses.forEach(r => {
      const g = r.genero
      counts[g] = (counts[g] || 0) + 1
    })
    const total = responses.length || 1
    return Object.entries(counts).map(([key, value]) => ({
      name: labels[key] || key,
      value,
      percentage: ((value / total) * 100).toFixed(1) + '%',
    }))
  }
}
// ────────────────────────────────────────────────────────────

// ── Estrategia: checkbox (arrays) ───────────────────────────
export class CheckboxCountStrategy implements ChartDataStrategy {
  buildChartData(responses: SurveyResponse[], field: keyof SurveyResponse): ChartDataPoint[] {
    const counts: Record<string, number> = {}
    responses.forEach(r => {
      const val = r[field]
      if (Array.isArray(val)) {
        val.forEach((v: string) => { counts[v] = (counts[v] || 0) + 1 })
      }
    })
    const total = responses.length || 1
    return Object.entries(counts).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / total) * 100).toFixed(1) + '%',
    }))
  }
}
// ────────────────────────────────────────────────────────────

// ── Contexto que usa una Strategy ───────────────────────────
export class ChartContext {
  private strategy: ChartDataStrategy

  constructor(strategy: ChartDataStrategy) {
    this.strategy = strategy
  }

  /** Permite cambiar la estrategia en tiempo de ejecución */
  setStrategy(strategy: ChartDataStrategy): void {
    this.strategy = strategy
    console.log(`[Strategy] Estrategia cambiada a: ${strategy.constructor.name}`)
  }

  execute(responses: SurveyResponse[], field: keyof SurveyResponse): ChartDataPoint[] {
    return this.strategy.buildChartData(responses, field)
  }
}
