// ============================================================
// PATRÓN 3: FACTORY METHOD
// ============================================================
// En vez de crear cada pregunta a mano, usamos una "fábrica"
// que se encarga de construirlas. Le decimos qué tipo de
// pregunta queremos y ella nos la arma.
// ============================================================

// Tipos de preguntas que puede haber en el formulario
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

// La fábrica: tiene métodos estáticos para crear cada tipo de pregunta
export class QuestionFactory {

  // Crea una pregunta de opción única (radio button)
  static createRadio(id: string, title: string, options: QuestionOption[], section: string): Question {
    return { id, type: 'radio', title, options, required: true, section }
  }

  // Crea una pregunta de selección múltiple (checkboxes)
  static createCheckbox(id: string, title: string, options: QuestionOption[], section: string): Question {
    return { id, type: 'checkbox', title, options, required: false, section }
  }

  // Crea una barra deslizable
  static createSlider(id: string, title: string, section: string): Question {
    return { id, type: 'slider', title, required: true, section }
  }

  // Crea una escala de valoración
  static createScale(id: string, title: string, options: QuestionOption[], section: string): Question {
    return { id, type: 'scale', title, options, required: true, section }
  }
}

// Acá definimos todas las preguntas del formulario usando la fábrica
export const SURVEY_QUESTIONS = {
  genero: QuestionFactory.createRadio('genero', '¿Con qué género te identificás?', [
    { value: 'femenino', label: 'Femenino' },
    { value: 'masculino', label: 'Masculino' },
    { value: 'otro', label: 'Otro' },
    { value: 'prefiero_no_decir', label: 'Prefiero no decirlo' },
  ], 'Datos personales'),

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
