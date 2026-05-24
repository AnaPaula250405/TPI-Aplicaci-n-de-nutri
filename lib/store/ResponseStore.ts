/**
 * ============================================================
 * PATRÓN 1: SINGLETON
 * ============================================================
 * Garantiza que exista UNA SOLA instancia del almacén de
 * respuestas en todo el servidor Next.js.
 * Todos los accesos (guardar, leer) pasan por esta instancia.
 * ============================================================
 */

export interface SurveyResponse {
  id: string
  timestamp: string
  genero: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir'
  // Sección 1 - Consumo
  consumiriaNuevamente: 'si' | 'no' | 'tal_vez'
  compraria: 'definitivamente_si' | 'quizas' | 'no'
  // Sección 2 - Opinión personal
  mejoraria: string[]
  mejoriaOtro: string
  nivelAgrado: number // 0=no me gusta, 50=ni gusta ni disgusta, 100=me gusta
  // Sección 3 - Perfil sensorial
  saborPredominante: string
  dulzor: 'bajo' | 'medio' | 'alto' | 'muy_alto'
  humedad: 'muy_seco' | 'seco' | 'adecuado' | 'humedo' | 'muy_humedo'
  color: 'desagradable' | 'poco_agradable' | 'agradable'
}

class ResponseStore {
  // ── Singleton: instancia única ──────────────────────────────
  private static instance: ResponseStore | null = null

  private responses: SurveyResponse[] = []

  private constructor() {
    // Constructor privado: nadie puede hacer "new ResponseStore()"
  }

  /** Punto de acceso global a la única instancia */
  public static getInstance(): ResponseStore {
    if (!ResponseStore.instance) {
      ResponseStore.instance = new ResponseStore()
      console.log('[Singleton] ResponseStore: nueva instancia creada')
    }
    return ResponseStore.instance
  }
  // ────────────────────────────────────────────────────────────

  public addResponse(response: SurveyResponse): void {
    this.responses.push(response)
    console.log(`[Singleton] Total respuestas guardadas: ${this.responses.length}`)
  }

  public getAllResponses(): SurveyResponse[] {
    return [...this.responses]
  }

  public getCount(): number {
    return this.responses.length
  }
}

// Exportamos sólo el acceso al Singleton
export const getStore = () => ResponseStore.getInstance()
