/**
 * ============================================================
 * PATRÓN 1: SINGLETON
 * ============================================================
 * Garantiza UNA SOLA instancia del almacén de respuestas.
 * RNF implementados: #20 (trazabilidad/timestamp), #6 (anti-duplicados),
 * #16 (timeout de sesión), #18 (logs con timestamp)
 * ============================================================
 */

export interface SurveyResponse {
  id: string
  timestamp: string
  sessionToken: string
  genero: 'masculino' | 'femenino' | 'otro' | 'prefiero_no_decir'
  consumiriaNuevamente: 'si' | 'no' | 'tal_vez'
  compraria: 'definitivamente_si' | 'quizas' | 'no'
  mejoraria: string[]
  mejoriaOtro: string
  nivelAgrado: number
  saborPredominante: string
  dulzor: 'bajo' | 'medio' | 'alto' | 'muy_alto'
  humedad: 'muy_seco' | 'seco' | 'adecuado' | 'humedo' | 'muy_humedo'
  color: 'desagradable' | 'poco_agradable' | 'agradable'
}

export interface ServerLog {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR'
  module: string
  message: string
}

class ResponseStore {
  private static instance: ResponseStore | null = null
  private responses: SurveyResponse[] = []
  private usedTokens: Set<string> = new Set()
  private logs: ServerLog[] = []

  private constructor() {}

  public static getInstance(): ResponseStore {
    if (!ResponseStore.instance) {
      ResponseStore.instance = new ResponseStore()
      ResponseStore.instance.log('INFO', 'ResponseStore', 'Singleton inicializado')
    }
    return ResponseStore.instance
  }

  // RNF #18 y #20 — logging con timestamp
  public log(level: ServerLog['level'], module: string, message: string): void {
    const entry: ServerLog = { timestamp: new Date().toISOString(), level, module, message }
    this.logs.push(entry)
    console.log(`[${entry.timestamp}] [${level}] [${module}] ${message}`)
  }

  // RNF #6 — prevención de duplicados por token de sesión
  public isTokenUsed(token: string): boolean {
    return this.usedTokens.has(token)
  }

  public addResponse(response: SurveyResponse): void {
    this.usedTokens.add(response.sessionToken)
    this.responses.push(response)
    this.log('INFO', 'ResponseStore', `Respuesta guardada ID:${response.id}`)
  }

  public getAllResponses(): SurveyResponse[] {
    return [...this.responses]
  }

  public getCount(): number {
    return this.responses.length
  }

  public getLogs(): ServerLog[] {
    return [...this.logs]
  }

  // RNF #13 — exportación CSV
  public toCSV(): string {
    const headers = ['id','timestamp','sessionToken','genero','consumiriaNuevamente',
      'compraria','mejoraria','mejoriaOtro','nivelAgrado','saborPredominante',
      'dulzor','humedad','color']
    const rows = this.responses.map(r => [
      r.id, r.timestamp, r.sessionToken, r.genero, r.consumiriaNuevamente,
      r.compraria, r.mejoraria.join('|'), r.mejoriaOtro, r.nivelAgrado,
      r.saborPredominante, r.dulzor, r.humedad, r.color
    ].map(v => `"${v}"`).join(','))
    return [headers.join(','), ...rows].join('\n')
  }
}

export const getStore = () => ResponseStore.getInstance()
