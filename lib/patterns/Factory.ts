/**
 * ============================================================
 * PATRÓN 3: FACTORY METHOD
 * ============================================================
 * Delega la creación de objetos "pregunta" a subclases/métodos
 * especializados. El cliente (formulario) no sabe cómo se
 * construye cada pregunta, sólo las consume.
 * ============================================================
 */

// ── Tipos de preguntas ───────────────────────────────────────
export type QuestionType = 'radio' | 'checkbox' | 'slider' | 'scale'

export interface QuestionOption {
  value: string
  label: string
}

export interface Question {
  id: string
  type: QuestionType
  title: string
  options?: QuestionOption[]
  required: boolean
  section: string
}
// ────────────────────────────────────────────────────────────

// ── Clase base abstracta ─────────────────────────────────────
abstract class QuestionCreator {
  abstract createQuestion(): Question
}
// ────────────────────────────────────────────────────────────

// ── Creadores concretos ──────────────────────────────────────

class RadioQuestionCreator extends QuestionCreator {
  constructor(
    private id: string,
    private title: string,
    private options: QuestionOption[],
    private section: string
  ) { super() }

  createQuestion(): Question {
    return { id: this.id, type: 'radio', title: this.title, options: this.options, required: true, section: this.section }
  }
}

class CheckboxQuestionCreator extends QuestionCreator {
  constructor(
    private id: string,
    private title: string,
    private options: QuestionOption[],
    private section: string
  ) { super() }

  createQuestion(): Question {
    return { id: this.id, type: 'checkbox', title: this.title, options: this.options, required: false, section: this.section }
  }
}

class SliderQuestionCreator extends QuestionCreator {
  constructor(private id: string, private title: string, private section: string) { super() }

  createQuestion(): Question {
    return { id: this.id, type: 'slider', title: this.title, required: true, section: this.section }
  }
}

class ScaleQuestionCreator extends QuestionCreator {
  constructor(
    private id: string,
    private title: string,
    private options: QuestionOption[],
    private section: string
  ) { super() }

  createQuestion(): Question {
    return { id: this.id, type: 'scale', title: this.title, options: this.options, required: true, section: this.section }
  }
}
// ────────────────────────────────────────────────────────────

// ── Fábrica principal ────────────────────────────────────────
export class QuestionFactory {
  static createRadio(id: string, title: string, options: QuestionOption[], section: string): Question {
    return new RadioQuestionCreator(id, title, options, section).createQuestion()
  }
  static createCheckbox(id: string, title: string, options: QuestionOption[], section: string): Question {
    return new CheckboxQuestionCreator(id, title, options, section).createQuestion()
  }
  static createSlider(id: string, title: string, section: string): Question {
    return new SliderQuestionCreator(id, title, section).createQuestion()
  }
  static createScale(id: string, title: string, options: QuestionOption[], section: string): Question {
    return new ScaleQuestionCreator(id, title, options, section).createQuestion()
  }
}
// ────────────────────────────────────────────────────────────

// ── Definición de todas las preguntas del formulario ─────────
export const SURVEY_QUESTIONS = {
  // Datos demográficos
  genero: QuestionFactory.createRadio('genero', '¿Con qué género te identificás?', [
    { value: 'femenino', label: 'Femenino' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'otro', label: 'Otro' },
    { value: 'prefiero_no_decir', label: 'Prefiero no decirlo' },
  ], 'Datos personales'),

  // Sección 1 - Consumo
  consumiriaNuevamente: QuestionFactory.createRadio('consumiriaNuevamente', '¿Consumirías nuevamente este producto?', [
    { value: 'si', label: 'Sí' },
    { value: 'no', label: 'No' },
    { value: 'tal_vez', label: 'Tal vez' },
  ], 'Intención de consumo'),

  compraria: QuestionFactory.createRadio('compraria', '¿Comprarías este budín si supieras que es alto en fibra y proteína?', [
    { value: 'definitivamente_si', label: 'Definitivamente sí' },
    { value: 'quizas', label: 'Quizás' },
    { value: 'no', label: 'No' },
  ], 'Intención de consumo'),

  // Sección 2 - Opinión personal
  mejoraria: QuestionFactory.createCheckbox('mejoraria', '¿Qué mejorarías del producto?', [
    { value: 'textura', label: 'Textura' },
    { value: 'sabor', label: 'Sabor' },
    { value: 'dulzor', label: 'Dulzor' },
    { value: 'humedad', label: 'Humedad' },
    { value: 'aroma', label: 'Aroma' },
    { value: 'color', label: 'Color' },
    { value: 'otro', label: 'Otro' },
  ], 'Opinión personal'),

  nivelAgrado: QuestionFactory.createSlider('nivelAgrado', 'Nivel de agrado general', 'Opinión personal'),

  // Sección 3 - Perfil sensorial
  saborPredominante: QuestionFactory.createRadio('saborPredominante', '¿Cuál es el sabor predominante?', [
    { value: 'banana', label: 'Banana' },
    { value: 'zanahoria', label: 'Zanahoria' },
    { value: 'lenteja', label: 'Lenteja' },
    { value: 'vainilla', label: 'Esencia de vainilla' },
  ], 'Perfil sensorial'),

  dulzor: QuestionFactory.createScale('dulzor', 'Nivel de dulzor', [
    { value: 'bajo', label: 'Bajo' },
    { value: 'medio', label: 'Medio' },
    { value: 'alto', label: 'Alto' },
    { value: 'muy_alto', label: 'Muy alto' },
  ], 'Perfil sensorial'),

  humedad: QuestionFactory.createScale('humedad', 'Nivel de humedad', [
    { value: 'muy_seco', label: 'Muy seco' },
    { value: 'seco', label: 'Seco' },
    { value: 'adecuado', label: 'Adecuado' },
    { value: 'humedo', label: 'Húmedo' },
    { value: 'muy_humedo', label: 'Muy húmedo' },
  ], 'Perfil sensorial'),

  color: QuestionFactory.createScale('color', 'Apreciación del color', [
    { value: 'desagradable', label: 'Desagradable' },
    { value: 'poco_agradable', label: 'Poco agradable' },
    { value: 'agradable', label: 'Agradable' },
  ], 'Perfil sensorial'),
}
