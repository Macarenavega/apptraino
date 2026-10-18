// Rutina Principiante — Calistenia: Tren Superior (Fuerza) + Tren Inferior (Hipertrofia)

export type Target =
  | { kind: 'reps'; min: number; max: number; perSide?: boolean }
  | { kind: 'seconds'; min: number; max: number }
  | { kind: 'minutes'; min: number; max: number }
  | { kind: 'check'; label: string }

export type CautionId = 'superman' | 'pike' | 'rdl' | 'abdomen'

export type Exercise = {
  id: string
  name: string
  sets: number
  target: Target
  /** Descanso entre series, en segundos (0 = sin descanso) */
  rest: number
  note?: string
  /** Qué anotar como "nivel" para medir la progresión */
  levelHint?: string
  /** Ejercicio que requiere aprobación de un profesional */
  caution?: CautionId
  /** Qué se hace en su lugar mientras no está aprobado */
  replacement?: Exercise
  /** Nombre del ejercicio original cuando este es un reemplazo elegido */
  swappedFrom?: string
}

/** Ejercicio equivalente para cuando no se tiene el material (hereda series, reps y descanso) */
export type Alternative = {
  id: string
  name: string
  note?: string
  levelHint?: string
  perSide?: boolean
}

export type SessionId = 'supA' | 'infA' | 'supB' | 'infB' | 'full' | 'mov' | 'core' | 'abs'

export type Session = {
  id: SessionId
  name: string
  estimate?: string
  exercises: Exercise[]
}

export const CAUTIONS: Record<CautionId, { exercise: string; reason: string }> = {
  superman: {
    exercise: 'Superman (extensión lumbar suave)',
    reason: 'Carga la zona lumbar/sacra.',
  },
  pike: {
    exercise: 'Pike push up asistido',
    reason: 'Posición de cabeza/cuello inclinada (protrusión cervical).',
  },
  rdl: {
    exercise: 'Peso muerto rumano a una pierna asistido',
    reason: 'Flexión de cadera con bisagra de tronco (molestia en el sacro).',
  },
  abdomen: {
    exercise: 'Rutina de abdomen (4 ejercicios, 4 × 20)',
    reason:
      'Piernas elevadas sin apoyo con el tronco inclinado: flexión de cadera con carga en la zona lumbar/sacra, y volumen alto.',
  },
}

/** El primer ítem es el cardio del calentamiento (se usa para estimar calorías) */
export const WARMUP = [
  'Elíptica suave 10\'',
  'Movilidad de tobillo',
  'Movilidad de cadera',
  'Movilidad de hombro',
]

const BAND_HINT = 'Tensión de la banda (ej: suave, media, fuerte)'

const walking = (id: string, min: number, max: number, note?: string): Exercise => ({
  id,
  name: 'Caminata (bajo impacto)',
  sets: 1,
  target: { kind: 'minutes', min, max },
  rest: 0,
  note: note ?? 'Intensidad moderada: poder hablar mientras se hace',
})

/**
 * Core diario: un ejercicio por día, rotando. Todos sin flexión de cuello ni carga
 * lumbar (nada de abdominales tipo crunch) por la protrusión cervical y el sacro.
 */
export const CORE_EXERCISES: Exercise[] = [
  {
    id: 'core-bird-dog',
    name: 'Bird dog (cuadrupedia, brazo y pierna contrarios)',
    sets: 2,
    target: { kind: 'reps', min: 8, max: 8, perSide: true },
    rest: 30,
    note: 'Lento y controlado: espalda quieta como una mesa',
  },
  {
    id: 'core-dead-bug',
    name: 'Dead bug',
    sets: 2,
    target: { kind: 'reps', min: 8, max: 8, perSide: true },
    rest: 30,
    note: 'Espalda baja pegada al suelo todo el tiempo',
  },
  {
    id: 'core-plancha-rodillas',
    name: 'Plancha con rodillas apoyadas',
    sets: 3,
    target: { kind: 'seconds', min: 20, max: 30 },
    rest: 30,
    note: 'Mirada al suelo, cuello neutro',
  },
  {
    id: 'core-plancha-lateral',
    name: 'Plancha lateral con rodillas apoyadas',
    sets: 2,
    target: { kind: 'seconds', min: 15, max: 20 },
    rest: 30,
    note: 'Haz un lado y luego el otro en cada serie',
    levelHint: 'Variante (ej: rodillas, pies)',
  },
  {
    id: 'core-transverso',
    name: 'Activación de transverso tumbada (vacío abdominal)',
    sets: 3,
    target: { kind: 'reps', min: 10, max: 10 },
    rest: 20,
    note: 'Cada repetición es una respiración: suelta el aire y mete el ombligo hacia adentro 3-5"',
  },
]

/** Ejercicio de core que toca un día dado (rota cada día) */
export function coreExerciseFor(date: Date) {
  const day = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000)
  return CORE_EXERCISES[day % CORE_EXERCISES.length]
}

export const SESSIONS: Record<SessionId, Session> = {
  abs: {
    id: 'abs',
    name: 'Abdomen (4 ejercicios)',
    estimate: '~15\'',
    exercises: [
      {
        id: 'abs-abrir-cerrar',
        name: 'Piernas abiertas y cerradas sobre las mancuernas',
        sets: 4,
        target: { kind: 'reps', min: 20, max: 20 },
        rest: 30,
        note: 'Si 20 cuesta con buena técnica, empieza con menos repeticiones',
        caution: 'abdomen',
      },
      {
        id: 'abs-lado-lado',
        name: 'Piernas juntas de lado a lado por encima de la mancuerna',
        sets: 4,
        target: { kind: 'reps', min: 20, max: 20 },
        rest: 30,
        note: 'Oblicuos. Cada pasada a un lado cuenta 1',
        caution: 'abdomen',
      },
      {
        id: 'abs-rodillas-diagonal',
        name: 'Recoger rodillas y estirar las piernas en diagonal',
        sets: 4,
        target: { kind: 'reps', min: 20, max: 20 },
        rest: 30,
        note: 'Alterna el lado hacia el que estiras',
        caution: 'abdomen',
      },
      {
        id: 'abs-barrido-bajo',
        name: 'Barrido bajo de piernas de lado a lado',
        sets: 4,
        target: { kind: 'reps', min: 20, max: 20 },
        rest: 30,
        note: 'Piernas cerca del suelo, rodillas semiflexionadas',
        caution: 'abdomen',
      },
    ],
  },
  core: {
    id: 'core',
    name: 'Core diario',
    estimate: '~5\'',
    exercises: CORE_EXERCISES,
  },
  supA: {
    id: 'supA',
    name: 'Tren Superior A',
    estimate: '~40\'',
    exercises: [
      {
        id: 'pushup-inclinado',
        name: 'Push up inclinado (manos en silla/mesa firme)',
        sets: 3,
        target: { kind: 'reps', min: 8, max: 12 },
        rest: 90,
        note: 'Cuanto más alto el apoyo, más fácil; bajar la altura a medida que progresa',
        levelHint: 'Altura del apoyo (ej: mesa, silla, escalón)',
      },
      {
        id: 'remo-banda',
        name: 'Remo con banda elástica (de pie, pisando la banda)',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 12 },
        rest: 90,
        note: 'Codos cerca del cuerpo, apretar omóplatos',
        levelHint: BAND_HINT,
      },
      {
        id: 'press-hombro-banda',
        name: 'Press de hombro con banda elástica (de pie)',
        sets: 2,
        target: { kind: 'reps', min: 10, max: 12 },
        rest: 90,
        levelHint: BAND_HINT,
      },
      {
        id: 'plancha-rodillas',
        name: 'Plancha con rodillas apoyadas',
        sets: 3,
        target: { kind: 'seconds', min: 20, max: 30 },
        rest: 60,
        note: 'Progresión hacia plancha completa más adelante',
        levelHint: 'Variante (ej: rodillas, completa)',
      },
      {
        id: 'superman',
        name: 'Superman (extensión lumbar suave)',
        sets: 2,
        target: { kind: 'reps', min: 12, max: 12 },
        rest: 60,
        caution: 'superman',
      },
    ],
  },
  infA: {
    id: 'infA',
    name: 'Tren Inferior A',
    estimate: '~45\'',
    exercises: [
      {
        id: 'sentadilla-asistida',
        name: 'Sentadilla asistida (sostenida de una silla o marco de puerta)',
        sets: 3,
        target: { kind: 'reps', min: 12, max: 15 },
        rest: 90,
        note: 'Bajar hasta donde sea cómodo, sin forzar',
        levelHint: 'Asistencia (ej: mucha, poca, sin apoyo)',
      },
      {
        id: 'puente-gluteo',
        name: 'Puente de glúteo (hip thrust BW)',
        sets: 3,
        target: { kind: 'reps', min: 15, max: 15 },
        rest: 90,
        note: 'Pausa 1-2" arriba',
      },
      {
        id: 'zancada-estatica',
        name: 'Zancada estática con apoyo de silla',
        sets: 2,
        target: { kind: 'reps', min: 10, max: 10, perSide: true },
        rest: 90,
        note: 'Apoyo lateral para equilibrio',
        levelHint: 'Asistencia (ej: con silla, sin apoyo)',
      },
      {
        id: 'pantorrilla-a',
        name: 'Elevación de pantorrilla de pie',
        sets: 3,
        target: { kind: 'reps', min: 15, max: 20 },
        rest: 45,
        note: 'Apoyo en silla para equilibrio si hace falta',
      },
      {
        id: 'curl-femoral-banda',
        name: 'Curl femoral con banda elástica (tumbada boca abajo)',
        sets: 3,
        target: { kind: 'reps', min: 12, max: 12 },
        rest: 60,
        note: 'Banda anclada a algo fijo, flexionar rodilla contra resistencia',
        levelHint: BAND_HINT,
      },
      walking('caminata-a', 10, 15),
    ],
  },
  supB: {
    id: 'supB',
    name: 'Tren Superior B',
    estimate: '~40\'',
    exercises: [
      {
        id: 'pushup-rodillas',
        name: 'Push up de rodillas',
        sets: 3,
        target: { kind: 'reps', min: 8, max: 12 },
        rest: 90,
        note: 'Progresión respecto al push up inclinado de Superior A',
      },
      {
        id: 'remo-banda-ancho',
        name: 'Remo con banda elástica (agarre más ancho)',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 12 },
        rest: 90,
        note: 'Variación respecto a Superior A',
        levelHint: BAND_HINT,
      },
      {
        id: 'pike-pushup',
        name: 'Pike push up asistido (muy suave, rodillas algo flexionadas)',
        sets: 2,
        target: { kind: 'reps', min: 8, max: 10 },
        rest: 90,
        caution: 'pike',
        replacement: {
          id: 'press-hombro-banda-extra',
          name: 'Press de hombro con banda elástica (en lugar del pike push up)',
          sets: 2,
          target: { kind: 'reps', min: 10, max: 12 },
          rest: 90,
          note: 'Reemplazo mientras el pike push up no esté aprobado',
          levelHint: BAND_HINT,
        },
      },
      {
        id: 'dead-bug',
        name: 'Dead bug',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 10, perSide: true },
        rest: 60,
        note: 'Core, sin impacto',
      },
      {
        id: 'triceps-banda',
        name: 'Extensión de tríceps con banda elástica',
        sets: 2,
        target: { kind: 'reps', min: 12, max: 12 },
        rest: 60,
        levelHint: BAND_HINT,
      },
    ],
  },
  infB: {
    id: 'infB',
    name: 'Tren Inferior B',
    estimate: '~45\'',
    exercises: [
      {
        id: 'sentadilla-peso',
        name: 'Sentadilla con peso casero (mochila con libros, opcional)',
        sets: 3,
        target: { kind: 'reps', min: 12, max: 12 },
        rest: 90,
        note: 'Progresión de carga simple sin pesas de gimnasio',
        levelHint: 'Carga (ej: sin mochila, mochila 3 kg)',
      },
      {
        id: 'rdl-una-pierna',
        name: 'Peso muerto rumano a una pierna asistido (mano en pared)',
        sets: 3,
        target: { kind: 'reps', min: 8, max: 8, perSide: true },
        rest: 90,
        caution: 'rdl',
      },
      {
        id: 'step-up',
        name: 'Step-up en escalón bajo',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 10, perSide: true },
        rest: 90,
        note: 'Altura baja al inicio, subir con el tiempo',
        levelHint: 'Altura del escalón',
      },
      {
        id: 'puente-una-pierna',
        name: 'Puente de glúteo a una pierna',
        sets: 2,
        target: { kind: 'reps', min: 8, max: 8, perSide: true },
        rest: 60,
        note: 'Progresión respecto al puente bipodal de Inferior A',
      },
      {
        id: 'pantorrilla-b',
        name: 'Pantorrilla de pie',
        sets: 3,
        target: { kind: 'reps', min: 15, max: 15 },
        rest: 45,
      },
      walking('caminata-b', 10, 15),
    ],
  },
  full: {
    id: 'full',
    name: 'Full body ligero (Día 5)',
    exercises: [
      {
        id: 'full-pushup-inclinado',
        name: 'Push up inclinado',
        sets: 2,
        target: { kind: 'reps', min: 12, max: 12 },
        rest: 90,
        levelHint: 'Altura del apoyo (ej: mesa, silla, escalón)',
      },
      {
        id: 'full-remo-banda',
        name: 'Remo con banda',
        sets: 2,
        target: { kind: 'reps', min: 12, max: 12 },
        rest: 90,
        levelHint: BAND_HINT,
      },
      {
        id: 'full-sentadilla-asistida',
        name: 'Sentadilla asistida',
        sets: 2,
        target: { kind: 'reps', min: 15, max: 15 },
        rest: 90,
        levelHint: 'Asistencia (ej: mucha, poca, sin apoyo)',
      },
      walking('full-caminata', 15, 20, ''),
    ],
  },
  mov: {
    id: 'mov',
    name: 'Movilidad + caminata (Día 6, opcional)',
    exercises: [
      {
        id: 'movilidad-general',
        name: 'Movilidad general',
        sets: 1,
        target: { kind: 'check', label: 'Hecha' },
        rest: 0,
        note: 'Sin ejercicios de fuerza. Solo si el cuerpo responde bien.',
      },
      walking('mov-caminata', 20, 30, ''),
    ],
  },
}

export type DayPlan = { session?: SessionId; restLabel?: string }

const REST_PHASE1 = 'Descanso o caminata ligera opcional'

/** Índice por día de la semana: 0 = domingo … 6 = sábado */
export const SCHEDULE: Record<1 | 2, DayPlan[]> = {
  1: [
    { restLabel: REST_PHASE1 },
    { session: 'supA' },
    { session: 'infA' },
    { restLabel: REST_PHASE1 },
    { session: 'supB' },
    { session: 'infB' },
    { restLabel: REST_PHASE1 },
  ],
  2: [
    { session: 'mov' },
    { session: 'supA' },
    { session: 'infA' },
    { restLabel: 'Descanso o caminata suave 20\'' },
    { session: 'supB' },
    { session: 'infB' },
    { session: 'full' },
  ],
}

export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
export const DAY_SHORT = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

/** Orden de las sesiones de cada fase cuando el usuario elige sus días */
export const PHASE_ORDER: Record<1 | 2, SessionId[]> = {
  1: ['supA', 'infA', 'supB', 'infB'],
  2: ['supA', 'infA', 'supB', 'infB', 'full', 'mov'],
}

const REST_CUSTOM = 'Descanso o caminata ligera opcional'

/** Lunes de la semana de una fecha, como 'AAAA-MM-DD' (clave del plan semanal) */
export function weekKey(date: Date) {
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7))
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * Plan de la semana: con los días elegidos asigna las sesiones de la fase en orden
 * (Superior A, Inferior A, Superior B, Inferior B…). Sin días elegidos usa el plan por defecto.
 */
export function planWeek(phase: 1 | 2, days?: number[]): DayPlan[] {
  if (!days) return SCHEDULE[phase]
  const plan: DayPlan[] = Array.from({ length: 7 }, () => ({ restLabel: REST_CUSTOM }))
  const order = PHASE_ORDER[phase]
  // La semana empieza el lunes: L M X J V S D
  const sorted = [...days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
  sorted.slice(0, order.length).forEach((d, i) => (plan[d] = { session: order[i] }))
  return plan
}

/** Sesiones de la fase que no entran en los días elegidos */
export function missingSessions(phase: 1 | 2, days?: number[]) {
  if (!days) return []
  return PHASE_ORDER[phase].slice(days.length)
}

export const PHASE2_CRITERIA = [
  'Terminé las 4 semanas de Fase 1 sin dolor articular',
  'Completo todas las series con buena técnica',
  'Siento que puedo sumar más',
]

export const PHASE1_DAYS = 28

export type Approvals = Record<CautionId, boolean>

const KG_HINT = 'Peso (kg)'

const ALT = {
  remoMancuerna: {
    id: 'alt-remo-mancuerna',
    name: 'Remo con mancuerna a una mano (apoyo en banco)',
    perSide: true,
    levelHint: KG_HINT,
  },
  remoPolea: { id: 'alt-remo-polea', name: 'Remo sentado en polea baja', levelHint: KG_HINT },
  remoPoleaAncho: {
    id: 'alt-remo-polea-ancho',
    name: 'Remo sentado en polea baja con barra (agarre ancho)',
    levelHint: KG_HINT,
  },
  pressMancuernas: {
    id: 'alt-press-hombro-mancuernas',
    name: 'Press de hombro con mancuernas sentada (con respaldo)',
    note: 'El respaldo protege la zona lumbar',
    levelHint: KG_HINT,
  },
  pressMaquina: { id: 'alt-press-hombro-maquina', name: 'Press de hombro en máquina', levelHint: KG_HINT },
  curlSentado: { id: 'alt-curl-femoral-sentado', name: 'Curl femoral sentada en máquina', levelHint: KG_HINT },
  curlTumbado: {
    id: 'alt-curl-femoral-tumbado',
    name: 'Curl femoral tumbada en máquina',
    note: 'Cadera pegada al banco, sin arquear la espalda baja',
    levelHint: KG_HINT,
  },
  tricepsPolea: { id: 'alt-triceps-polea', name: 'Extensión de tríceps en polea alta', levelHint: KG_HINT },
  tricepsTumbada: {
    id: 'alt-triceps-mancuerna',
    name: 'Extensión de tríceps con mancuernas tumbada en banco',
    note: 'La cabeza queda apoyada: cuida el cuello',
    levelHint: KG_HINT,
  },
  goblet: {
    id: 'alt-goblet',
    name: 'Sentadilla goblet (mancuerna o kettlebell al pecho)',
    levelHint: KG_HINT,
  },
  cinta: { id: 'alt-cinta', name: 'Caminata en cinta' },
  bici: { id: 'alt-bici', name: 'Bicicleta estática' },
  eliptica: { id: 'alt-eliptica', name: 'Elíptica' },
} satisfies Record<string, Alternative>

const remoOptions = [ALT.remoMancuerna, ALT.remoPolea]
const pressOptions = [ALT.pressMancuernas, ALT.pressMaquina]
const cardioOptions = [ALT.cinta, ALT.bici, ALT.eliptica]

/**
 * Alternativas por ejercicio. Los ejercicios del mismo grupo comparten la elección:
 * si cambias el remo con banda por el de mancuerna, se cambia en todas las sesiones.
 */
const ALTERNATIVES: Record<string, { group: string; options: Alternative[] }> = {
  'remo-banda': { group: 'remo-banda', options: remoOptions },
  'full-remo-banda': { group: 'remo-banda', options: remoOptions },
  'remo-banda-ancho': { group: 'remo-banda-ancho', options: [ALT.remoPoleaAncho, ALT.remoMancuerna] },
  'press-hombro-banda': { group: 'press-hombro-banda', options: pressOptions },
  'press-hombro-banda-extra': { group: 'press-hombro-banda', options: pressOptions },
  'curl-femoral-banda': { group: 'curl-femoral-banda', options: [ALT.curlSentado, ALT.curlTumbado] },
  'triceps-banda': { group: 'triceps-banda', options: [ALT.tricepsPolea, ALT.tricepsTumbada] },
  'sentadilla-peso': { group: 'sentadilla-peso', options: [ALT.goblet] },
  'caminata-a': { group: 'caminata', options: cardioOptions },
  'caminata-b': { group: 'caminata', options: cardioOptions },
  'full-caminata': { group: 'caminata', options: cardioOptions },
  'mov-caminata': { group: 'caminata', options: cardioOptions },
}

/** Elección del usuario por grupo: id de la alternativa */
export type Swaps = Record<string, string>

function toExercise(slot: Exercise, alt: Alternative): Exercise {
  const target = alt.perSide && slot.target.kind === 'reps' ? { ...slot.target, perSide: true } : slot.target
  return {
    ...slot,
    id: alt.id,
    name: alt.name,
    note: alt.note,
    levelHint: alt.levelHint,
    target,
    caution: undefined,
    replacement: undefined,
    swappedFrom: slot.name,
  }
}

/** Opciones para un ejercicio: el original primero y luego sus alternativas */
export function swapOptions(slot: Exercise) {
  const entry = ALTERNATIVES[slot.id]
  if (!entry) return undefined
  return { group: entry.group, options: [slot, ...entry.options.map((a) => toExercise(slot, a))] }
}

function applySwap(slot: Exercise, swaps: Swaps) {
  const sw = swapOptions(slot)
  const chosen = sw && swaps[sw.group]
  return (chosen && sw.options.find((o) => o.id === chosen)) || slot
}

/** Ejercicios a realizar según lo aprobado por el profesional y los reemplazos elegidos */
export function resolveExercises(session: Session, approvals: Approvals, swaps: Swaps = {}) {
  const active: Exercise[] = []
  const blocked: Exercise[] = []
  const slots: Exercise[] = []
  for (const ex of session.exercises) {
    if (ex.caution && !approvals[ex.caution]) {
      blocked.push(ex)
      if (ex.replacement) slots.push(ex.replacement)
    } else {
      slots.push(ex)
    }
  }
  for (const slot of slots) active.push(applySwap(slot, swaps))
  return { active, blocked, slots }
}

/** Busca el ejercicio original (y sus opciones) del que salió un ejercicio de la sesión */
export function findSlot(session: Session, approvals: Approvals, exerciseId: string) {
  for (const slot of resolveExercises(session, approvals).slots) {
    const sw = swapOptions(slot)
    if (slot.id === exerciseId) return { slot, exercise: slot, swap: sw }
    const exercise = sw?.options.find((o) => o.id === exerciseId)
    if (exercise) return { slot, exercise, swap: sw }
  }
  return undefined
}

/** Nombre legible de la alternativa elegida para un grupo */
export function alternativeName(id: string) {
  return Object.values(ALT).find((a) => a.id === id)?.name
}

/** Nombre del ejercicio original de un grupo */
export function groupName(group: string) {
  const slotId = Object.entries(ALTERNATIVES).find(([, v]) => v.group === group)?.[0]
  for (const session of Object.values(SESSIONS)) {
    for (const ex of session.exercises) {
      if (ex.id === slotId) return ex.name
      if (ex.replacement && ex.replacement.id === slotId) return ex.replacement.name
    }
  }
  return group
}

export function formatTarget(t: Target, sets: number) {
  switch (t.kind) {
    case 'reps': {
      const r = t.min === t.max ? `${t.min}` : `${t.min}-${t.max}`
      return `${sets} x ${r}${t.perSide ? ' por lado' : ''}`
    }
    case 'seconds':
      return `${sets} x ${t.min}-${t.max}"`
    case 'minutes':
      return `${t.min}-${t.max}'`
    case 'check':
      return t.label
  }
}

export type ExerciseImage = {
  /** Carpeta en public/exercises (tomada de free-exercise-db, dominio público) */
  folder: string
  /** Aclaración cuando la imagen no es exactamente tu variante */
  note?: string
}

/** Imágenes de referencia (posición inicial y final) por ejercicio */
export const EXERCISE_IMAGES: Record<string, ExerciseImage> = {
  'pushup-inclinado': { folder: 'Incline_Push-Up' },
  'full-pushup-inclinado': { folder: 'Incline_Push-Up' },
  'press-hombro-banda': { folder: 'Shoulder_Press_-_With_Bands' },
  'press-hombro-banda-extra': { folder: 'Shoulder_Press_-_With_Bands' },
  'plancha-rodillas': { folder: 'Plank', note: 'La imagen muestra la plancha completa; tú apoyas las rodillas.' },
  superman: { folder: 'Superman' },
  'sentadilla-asistida': {
    folder: 'Bodyweight_Squat',
    note: 'La imagen es sin apoyo; tú te sostienes de una silla o marco de puerta.',
  },
  'full-sentadilla-asistida': {
    folder: 'Bodyweight_Squat',
    note: 'La imagen es sin apoyo; tú te sostienes de una silla o marco de puerta.',
  },
  'sentadilla-peso': { folder: 'Bodyweight_Squat', note: 'Puedes sumar una mochila con libros como carga.' },
  'puente-gluteo': { folder: 'Butt_Lift_Bridge' },
  'zancada-estatica': {
    folder: 'Bodyweight_Walking_Lunge',
    note: 'La imagen muestra la zancada caminando; tú la haces en el lugar y con apoyo de una silla.',
  },
  'pantorrilla-a': { folder: 'Calf_Raises_-_With_Bands', note: 'Tú la haces sin banda.' },
  'pantorrilla-b': { folder: 'Calf_Raises_-_With_Bands', note: 'Tú la haces sin banda.' },
  'dead-bug': { folder: 'Dead_Bug' },
  'triceps-banda': { folder: 'Speed_Band_Overhead_Triceps', note: 'Una variante posible: extensión por encima de la cabeza.' },
  'step-up': { folder: 'Step-up_with_Knee_Raise', note: 'La imagen agrega elevar la rodilla; tú solo subes y bajas del escalón.' },
  'puente-una-pierna': { folder: 'Single_Leg_Glute_Bridge' },
  'alt-remo-mancuerna': { folder: 'One-Arm_Dumbbell_Row' },
  'alt-remo-polea': { folder: 'Seated_Cable_Rows' },
  'alt-remo-polea-ancho': { folder: 'Seated_Cable_Rows', note: 'La imagen usa un agarre cerrado; tú usa una barra con las manos más abiertas.' },
  'alt-press-hombro-mancuernas': { folder: 'Dumbbell_Shoulder_Press' },
  'alt-press-hombro-maquina': { folder: 'Machine_Shoulder_Military_Press' },
  'alt-curl-femoral-sentado': { folder: 'Seated_Leg_Curl' },
  'alt-curl-femoral-tumbado': { folder: 'Lying_Leg_Curls' },
  'alt-triceps-polea': { folder: 'Triceps_Pushdown' },
  'alt-triceps-mancuerna': { folder: 'Lying_Dumbbell_Tricep_Extension' },
  'alt-goblet': { folder: 'Goblet_Squat' },
  'alt-cinta': { folder: 'Walking_Treadmill' },
  'alt-bici': { folder: 'Bicycling_Stationary' },
  'core-dead-bug': { folder: 'Dead_Bug' },
  'core-plancha-rodillas': {
    folder: 'Plank',
    note: 'La imagen muestra la plancha completa; tú apoyas las rodillas.',
  },
  'core-plancha-lateral': {
    folder: 'Side_Bridge',
    note: 'La imagen apoya los pies; tú empieza con las rodillas dobladas y apoyadas.',
  },
  'core-transverso': { folder: 'Stomach_Vacuum', note: 'La imagen es de pie; tú hazlo tumbada boca arriba con las rodillas dobladas.' },
  'rdl-una-pierna': {
    folder: 'Kettlebell_One-Legged_Deadlift',
    note: 'La imagen usa una pesa rusa; tú lo haces sin peso y con una mano en la pared.',
  },
}
