// Rutina Principiante — Calistenia: Tren Superior (Fuerza) + Tren Inferior (Hipertrofia)

export type Target =
  | { kind: 'reps'; min: number; max: number; perSide?: boolean }
  | { kind: 'seconds'; min: number; max: number }
  | { kind: 'minutes'; min: number; max: number }
  | { kind: 'check'; label: string }

export type CautionId = 'superman' | 'pike' | 'rdl'

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
}

export type SessionId = 'supA' | 'infA' | 'supB' | 'infB' | 'full' | 'mov'

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
}

export const WARMUP = [
  'Caminata suave 5\'',
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

export const SESSIONS: Record<SessionId, Session> = {
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

export const PHASE2_CRITERIA = [
  'Terminé las 4 semanas de Fase 1 sin dolor articular',
  'Completo todas las series con buena técnica',
  'Siento que puedo sumar más',
]

export const PHASE1_DAYS = 28

export type Approvals = Record<CautionId, boolean>

/** Ejercicios a realizar según lo aprobado por el profesional */
export function resolveExercises(session: Session, approvals: Approvals) {
  const active: Exercise[] = []
  const blocked: Exercise[] = []
  for (const ex of session.exercises) {
    if (ex.caution && !approvals[ex.caution]) {
      blocked.push(ex)
      if (ex.replacement) active.push(ex.replacement)
    } else {
      active.push(ex)
    }
  }
  return { active, blocked }
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
