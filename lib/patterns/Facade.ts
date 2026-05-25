/**
 * ============================================================
 * PATRÓN 5: FACADE
 * ============================================================
 */
import { getStore, SurveyResponse } from '../store/ResponseStore'
import { surveyEventBus } from './Observer'
import {
  ChartContext, CountStrategy, GenderDistributionStrategy,
  CheckboxCountStrategy, AverageStrategy, ChartDataPoint,
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

export class SurveyFacade {
  static submit(data: Omit<SurveyResponse, 'id' | 'timestamp'>): SurveyResponse {
    const response: SurveyResponse = {
      ...data,
      id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
    }
    getStore().addResponse(response)
    surveyEventBus.notify(response)
    return response
  }

  /** Procesa resultados desde un array de respuestas (usado con DB) */
  static getResultsFromData(responses: SurveyResponse[]): ResultsSummary {
    const countCtx  = new ChartContext(new CountStrategy())
    const genderCtx = new ChartContext(new GenderDistributionStrategy())
    const checkCtx  = new ChartContext(new CheckboxCountStrategy())
    const avgCtx    = new ChartContext(new AverageStrategy())

    const agradoPromedio = responses.length
      ? responses.reduce((a, r) => a + r.nivelAgrado, 0) / responses.length
      : 0

    return {
      totalResponses:  responses.length,
      generoChart:     genderCtx.execute(responses, 'genero'),
      consumiriaChart: countCtx.execute(responses,  'consumiriaNuevamente'),
      comprariaChart:  countCtx.execute(responses,  'compraria'),
      mejorariaChart:  checkCtx.execute(responses,  'mejoraria'),
      saborChart:      countCtx.execute(responses,  'saborPredominante'),
      dulzorChart:     countCtx.execute(responses,  'dulzor'),
      humedadChart:    countCtx.execute(responses,  'humedad'),
      colorChart:      countCtx.execute(responses,  'color'),
      agradoChart:     avgCtx.execute(responses,    'nivelAgrado'),
      agradoPromedio,
    }
  }

  /** Procesa resultados desde memoria (fallback) */
  static getResults(): ResultsSummary {
    return SurveyFacade.getResultsFromData(getStore().getAllResponses())
  }
}
