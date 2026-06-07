// ============================================================
// PATRÓN 2: OBSERVER
// ============================================================
// Imaginate que cuando llega una respuesta nueva, queremos
// avisarle a varias partes del sistema automáticamente.
// El Observer hace exactamente eso: cuando pasa algo
// (el "sujeto"), todos los que están "escuchando" se enteran.
// ============================================================

import { SurveyResponse } from '../store/ResponseStore'

// Cualquier "escuchador" tiene que tener este método
export interface SurveyObserver {
  onResponseSubmitted(response: SurveyResponse): void
}

// El "sujeto" puede registrar y notificar escuchadores
export interface SurveySubject {
  subscribe(observer: SurveyObserver): void
  unsubscribe(observer: SurveyObserver): void
  notify(response: SurveyResponse): void
}

// El canal central de eventos
export class SurveyEventBus implements SurveySubject {
  private observers: SurveyObserver[] = []

  // Registrar un nuevo escuchador
  subscribe(observer: SurveyObserver): void {
    this.observers.push(observer)
  }

  // Quitar un escuchador
  unsubscribe(observer: SurveyObserver): void {
    this.observers = this.observers.filter(o => o !== observer)
  }

  // Avisar a todos los escuchadores que llegó una respuesta nueva
  notify(response: SurveyResponse): void {
    this.observers.forEach(observer => observer.onResponseSubmitted(response))
  }
}

// Escuchador 1: solo imprime en consola lo que llegó
export class LoggerObserver implements SurveyObserver {
  onResponseSubmitted(response: SurveyResponse): void {
    console.log(`[Observer/Logger] Nueva respuesta: ${response.id} | Género: ${response.genero}`)
  }
}

// Escuchador 2: cuenta cuántas respuestas llegaron
export class CounterObserver implements SurveyObserver {
  private count = 0
  onResponseSubmitted(_response: SurveyResponse): void {
    this.count++
    console.log(`[Observer/Counter] Total de respuestas: ${this.count}`)
  }
  getCount(): number { return this.count }
}

// Creamos el canal y le agregamos los dos escuchadores
export const surveyEventBus = new SurveyEventBus()
surveyEventBus.subscribe(new LoggerObserver())
surveyEventBus.subscribe(new CounterObserver())
