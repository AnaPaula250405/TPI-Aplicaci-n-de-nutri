// ============================================================
// PATRÓN 5: FACADE
// ============================================================
// Este patrón es como una "ventanilla única". En vez de que
// cada parte del código tenga que hablar con el Singleton,
// el Observer y el Strategy por separado, la Facade los
// une detrás de dos métodos simples:
//   - submit(): para guardar una respuesta
//   - getResults(): para obtener los resultados procesados
// ============================================================

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

// Cómo se ven los resultados procesados
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
  crujienteChart: ChartDataPoint[]
  agradoChart: ChartDataPoint[]
  agradoPromedio: number
  precioPromedio: number
}

export class SurveyFacade {

  // Guarda una respuesta nueva y avisa a los observers
  static submit(data: Omit<SurveyResponse, 'id' | 'timestamp'>): SurveyResponse {
    const response: SurveyResponse = {
      ...data,
      id: `resp_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: new Date().toISOString(),
    }
    // Guarda en el Singleton
    getStore().addResponse(response)
    // Notifica a los Observers
    surveyEventBus.notify(response)
    return response
  }

  // Procesa un array de respuestas con las Strategies
  static getResultsFromData(responses: SurveyResponse[]): ResultsSummary {
    const countCtx  = new ChartContext(new CountStrategy())
    const genderCtx = new ChartContext(new GenderDistributionStrategy())
    const checkCtx  = new ChartContext(new CheckboxCountStrategy())
    const avgCtx    = new ChartContext(new AverageStrategy())

    const agradoPromedio = responses.length
      ? responses.reduce((a, r) => a + r.nivelAgrado, 0) / responses.length
      : 0

    // Solo promediamos las respuestas donde el usuario completó el precio (mayor a 0)
    const responsesConPrecio = responses.filter(r => r.precioPagar && r.precioPagar > 0)
    const precioPromedio = responsesConPrecio.length
      ? responsesConPrecio.reduce((a, r) => a + r.precioPagar, 0) / responsesConPrecio.length
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
      crujienteChart:  countCtx.execute(responses,  'crujiente'),
      agradoChart:     avgCtx.execute(responses,    'nivelAgrado'),
      agradoPromedio,
      precioPromedio,
    }
  }

  // Procesa respuestas desde memoria (cuando no hay base de datos)
  static getResults(): ResultsSummary {
    return SurveyFacade.getResultsFromData(getStore().getAllResponses())
  }
}
