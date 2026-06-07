// ============================================================
// PATRÓN 1: SINGLETON
// ============================================================
// Este patrón asegura que solo exista UNA sola "caja" donde
// guardamos todas las respuestas. Si alguien intenta crear
// otra caja, le devolvemos la misma que ya existe.
// ============================================================

export interface SurveyResponse {
  id: string
  timestamp: string
  sessionToken: string
  genero: string
  consumiriaNuevamente: string
  compraria: string
  mejoraria: string[]
  mejoriaOtro: string
  nivelAgrado: number
  saborPredominante: string
  dulzor: string
  humedad: string
  color: string
  crujiente: string
  precioPagar: number
}

export interface ServerLog {
  timestamp: string
  level: 'INFO' | 'WARN' | 'ERROR'
  module: string
  message: string
}

class ResponseStore {
  // La única instancia que va a existir
  private static instance: ResponseStore | null = null

  private responses: SurveyResponse[] = []
  private usedTokens: Set<string> = new Set()
  private logs: ServerLog[] = []

  // Constructor privado: nadie puede hacer "new ResponseStore()" desde afuera
  private constructor() {}

  // Único punto de acceso al almacén
  public static getInstance(): ResponseStore {
    if (!ResponseStore.instance) {
      ResponseStore.instance = new ResponseStore()
      console.log('[Singleton] Almacén creado')
    }
    return ResponseStore.instance
  }

  public log(level: ServerLog['level'], module: string, message: string): void {
    const entry: ServerLog = { timestamp: new Date().toISOString(), level, module, message }
    this.logs.push(entry)
    console.log(`[${entry.timestamp}] [${level}] [${module}] ${message}`)
  }

  public isTokenUsed(token: string): boolean {
    return this.usedTokens.has(token)
  }

  public addResponse(response: SurveyResponse): void {
    this.usedTokens.add(response.sessionToken)
    this.responses.push(response)
    this.log('INFO', 'ResponseStore', `Respuesta guardada: ${response.id}`)
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

  public toCSV(): string {
    const headers = ['id','timestamp','genero','consumiriaNuevamente','compraria',
      'mejoraria','nivelAgrado','saborPredominante','dulzor','humedad','color','crujiente','precioPagar']
    const rows = this.responses.map(r => [
      r.id, r.timestamp, r.genero, r.consumiriaNuevamente, r.compraria,
      r.mejoraria.join('|'), r.nivelAgrado, r.saborPredominante,
      r.dulzor, r.humedad, r.color, r.crujiente, r.precioPagar
    ].map(v => `"${v}"`).join(','))
    return [headers.join(','), ...rows].join('\n')
  }
}

export const getStore = () => ResponseStore.getInstance()
