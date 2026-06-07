// ============================================================
// PATRÓN 4: STRATEGY
// ============================================================
// A veces necesitamos procesar los datos de distintas formas
// según el tipo de pregunta. En vez de tener un if gigante,
// usamos distintas "estrategias" intercambiables.
// Cada estrategia sabe cómo procesar un tipo de dato.
// ============================================================

import { SurveyResponse } from '../store/ResponseStore'

// Todas las estrategias tienen que implementar este método
export interface ChartDataStrategy {
  buildChartData(responses: SurveyResponse[], field: keyof SurveyResponse): ChartDataPoint[]
}

export interface ChartDataPoint {
  name: string
  value: number
  percentage: string
}

// Estrategia 1: contar cuántas veces aparece cada opción
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

// Estrategia 2: calcular el promedio (para el slider de agrado)
export class AverageStrategy implements ChartDataStrategy {
  buildChartData(responses: SurveyResponse[], field: keyof SurveyResponse): ChartDataPoint[] {
    if (responses.length === 0) return []
    const sum = responses.reduce((acc, r) => acc + (Number(r[field]) || 0), 0)
    const avg = sum / responses.length
    return [{ name: 'Promedio', value: avg, percentage: avg.toFixed(1) + ' / 100' }]
  }
}

// Estrategia 3: distribución por género
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
      counts[r.genero] = (counts[r.genero] || 0) + 1
    })
    const total = responses.length || 1
    return Object.entries(counts).map(([key, value]) => ({
      name: labels[key] || key,
      value,
      percentage: ((value / total) * 100).toFixed(1) + '%',
    }))
  }
}

// Estrategia 4: para preguntas de selección múltiple (arrays)
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

// El "contexto" que usa una estrategia y permite cambiarla
export class ChartContext {
  private strategy: ChartDataStrategy

  constructor(strategy: ChartDataStrategy) {
    this.strategy = strategy
  }

  // Podemos cambiar la estrategia en cualquier momento
  setStrategy(strategy: ChartDataStrategy): void {
    this.strategy = strategy
  }

  // Ejecuta la estrategia actual
  execute(responses: SurveyResponse[], field: keyof SurveyResponse): ChartDataPoint[] {
    return this.strategy.buildChartData(responses, field)
  }
}
