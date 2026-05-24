/**
 * ============================================================
 * PATRÓN 5: FACADE
 * ============================================================
 * Proporciona una interfaz simplificada a un subsistema
 * complejo. Oculta la complejidad del Singleton, Observer
 * y Strategy detrás de métodos de alto nivel.
 * El componente React sólo llama a SurveyFacade.submit()
 * y SurveyFacade.getResults() sin conocer los detalles.
 * ============================================================
 */

import { getStore, SurveyResponse } from '../store/ResponseStore'
import { surveyEventBus } from './Observer'
import {
  ChartContext,
  CountStrategy,
  GenderDistributionStrategy,
  CheckboxCountStrategy,
  AverageStrategy,
  ChartDataPoint,
} from './Strategy'

export interface ResultsSummary {
  totalResponses: number
  generoChart: ChartDataPoint[]
  consumiriaChart: ChartDataPoint[]
  comprariaChart: ChartDataPoint[]
  mejorariaChart: ChartDataPoint[]
  saborChart: ChartDataPoint[]
  dulzorChart: ChartDataPoint[]
  humedadChart: ChartDataPoint[]
  colorChart: ChartDataPoint[]
  agradoChart: ChartDataPoint[]
  agradoPromedio: number
}

// ── Facade ───────────────────────────────────────────────────
export class SurveyFacade {

  /**
   * Método principal: guarda la respuesta, notifica observadores.
   * El componente React llama SÓLO esto.
   */
  static submit(data: Omit<SurveyResponse, 'id' | 'timestamp'>): SurveyResponse {
    // 1. Construir la respuesta con id y timestamp
    const response: SurveyResponse = {
      ...data,
      id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
    }

    // 2. Guardar en Singleton
    getStore().addResponse(response)

    // 3. Notificar a todos los Observers
    surveyEventBus.notify(response)

    console.log('[Facade] submit() completado:', response.id)
    return response
  }

  /**
   * Obtiene todos los resultados procesados con las Strategies.
   */
  static getResults(): ResultsSummary {
    const responses = getStore().getAllResponses()

    const countCtx   = new ChartContext(new CountStrategy())
    const genderCtx  = new ChartContext(new GenderDistributionStrategy())
    const checkCtx   = new ChartContext(new CheckboxCountStrategy())
    const avgCtx     = new ChartContext(new AverageStrategy())

    // Promedio del slider de agrado
    const agradoPromedio = responses.length
      ? responses.reduce((a, r) => a + r.nivelAgrado, 0) / responses.length
      : 0

    return {
      totalResponses: responses.length,
      generoChart:     genderCtx.execute(responses,  'genero'),
      consumiriaChart: countCtx.execute(responses,   'consumiriaNuevamente'),
      comprariaChart:  countCtx.execute(responses,   'compraria'),
      mejorariaChart:  checkCtx.execute(responses,   'mejoraria'),
      saborChart:      countCtx.execute(responses,   'saborPredominante'),
      dulzorChart:     countCtx.execute(responses,   'dulzor'),
      humedadChart:    countCtx.execute(responses,   'humedad'),
      colorChart:      countCtx.execute(responses,   'color'),
      agradoChart:     avgCtx.execute(responses,     'nivelAgrado'),
      agradoPromedio,
    }
  }
}
// ────────────────────────────────────────────────────────────
