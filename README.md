# 🥕 Budín Orgánico — Evaluación Sensorial

App web desarrollada con **Next.js 14** para evaluar el budín de zanahoria, lenteja turca y banana.

---

## 🚀 Instalación y ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Abrir en el navegador
# Formulario:  http://localhost:3000
# Resultados:  http://localhost:3000/resultados
```

---

## 🏗️ Los 5 Patrones de Diseño implementados

### 1. 🔵 SINGLETON — `lib/store/ResponseStore.ts`
Garantiza que exista **una única instancia** del almacén de respuestas en todo el servidor.
```
ResponseStore.getInstance() → siempre la misma instancia
```

### 2. 🟢 OBSERVER — `lib/patterns/Observer.ts`
Cuando se envía una respuesta (Subject = SurveyEventBus),  
todos los observadores suscritos son notificados automáticamente.
- `LoggerObserver` → registra en consola
- `CounterObserver` → lleva conteo en tiempo real

### 3. 🟡 FACTORY METHOD — `lib/patterns/Factory.ts`
Creación de preguntas del formulario delegada a clases especializadas:
- `RadioQuestionCreator` → preguntas de opción única
- `CheckboxQuestionCreator` → preguntas de selección múltiple
- `SliderQuestionCreator` → barra de agrado
- `ScaleQuestionCreator` → escalas de valoración

### 4. 🟠 STRATEGY — `lib/patterns/Strategy.ts`
Diferentes algoritmos de análisis de datos, intercambiables en tiempo de ejecución:
- `CountStrategy` → conteo de opciones
- `AverageStrategy` → promedio del slider
- `GenderDistributionStrategy` → distribución por género
- `CheckboxCountStrategy` → análisis de respuestas múltiples

### 5. 🔴 FACADE — `lib/patterns/Facade.ts`
Interfaz simplificada que oculta la complejidad de todos los demás patrones:
```typescript
SurveyFacade.submit(data)    // guarda + notifica observers
SurveyFacade.getResults()    // procesa con strategies
```

---

## 📁 Estructura del proyecto

```
budin-app/
├── app/
│   ├── page.tsx                  # Formulario de evaluación
│   ├── layout.tsx                # Layout raíz
│   ├── globals.css               # Estilos globales (tema orgánico)
│   ├── resultados/
│   │   └── page.tsx              # Panel de resultados con gráficos
│   └── api/
│       ├── submit/route.ts       # POST - guardar respuesta
│       └── results/route.ts      # GET  - obtener resultados
├── components/
│   └── form/
│       └── AgradoSlider.tsx      # Slider de nivel de agrado
└── lib/
    ├── store/
    │   └── ResponseStore.ts      # PATRÓN: Singleton
    └── patterns/
        ├── Observer.ts           # PATRÓN: Observer
        ├── Factory.ts            # PATRÓN: Factory Method
        ├── Strategy.ts           # PATRÓN: Strategy
        └── Facade.ts             # PATRÓN: Facade
```

---

## 🎨 Diseño

Paleta de colores orgánicos: naranjas, tierras, cremas.  
Inspirada en la imagen del patrón de zanahoria y banana.

---

## ⚠️ Nota sobre persistencia

Los datos se almacenan **en memoria del servidor**. Al reiniciar el servidor los datos se pierden.
Para persistencia permanente, integrar con una base de datos (PostgreSQL, SQLite, etc.).

---

*Proyecto académico — Ingeniería en Sistemas de Información + Nutrición*
