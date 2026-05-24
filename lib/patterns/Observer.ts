/**
 * ============================================================
 * PATRÓN 2: OBSERVER
 * ============================================================
 * Define una relación 1-a-muchos entre objetos.
 * Cuando el formulario guarda una respuesta (Subject),
 * todos los observadores suscritos son notificados
 * automáticamente (ej: logger, contador, analítica).
 * ============================================================
 */

import { SurveyResponse } from '../store/ResponseStore'

// ── Interfaz Observer ────────────────────────────────────────
export interface SurveyObserver {
  onResponseSubmitted(response: SurveyResponse): void
}
// ────────────────────────────────────────────────────────────

// ── Interfaz Subject ─────────────────────────────────────────
export interface SurveySubject {
  subscribe(observer: SurveyObserver): void
  unsubscribe(observer: SurveyObserver): void
  notify(response: SurveyResponse): void
}
// ────────────────────────────────────────────────────────────

// ── Implementación del Subject ───────────────────────────────
export class SurveyEventBus implements SurveySubject {
  private observers: SurveyObserver[] = []

  subscribe(observer: SurveyObserver): void {
    this.observers.push(observer)
    console.log(`[Observer] Nuevo observador suscrito. Total: ${this.observers.length}`)
  }

  unsubscribe(observer: SurveyObserver): void {
    this.observers = this.observers.filter(o => o !== observer)
  }

  notify(response: SurveyResponse): void {
    console.log(`[Observer] Notificando a ${this.observers.length} observadores...`)
    this.observers.forEach(observer => observer.onResponseSubmitted(response))
  }
}
// ────────────────────────────────────────────────────────────

// ── Observadores concretos ───────────────────────────────────

/** Observador: registra cada respuesta en consola */
export class LoggerObserver implements SurveyObserver {
  onResponseSubmitted(response: SurveyResponse): void {
    console.log(`[Observer/Logger] Respuesta recibida ID:${response.id} | Género: ${response.genero}`)
  }
}

/** Observador: lleva conteo en tiempo real */
export class CounterObserver implements SurveyObserver {
  private count = 0
  onResponseSubmitted(_response: SurveyResponse): void {
    this.count++
    console.log(`[Observer/Counter] Total de respuestas registradas: ${this.count}`)
  }
  getCount(): number { return this.count }
}
// ────────────────────────────────────────────────────────────

// Instancia compartida del EventBus (usada por la Facade)
export const surveyEventBus = new SurveyEventBus()
surveyEventBus.subscribe(new LoggerObserver())
surveyEventBus.subscribe(new CounterObserver())
