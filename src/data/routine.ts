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
  /** Nivel con el que empieza el programa (si todavía no se hizo en este programa) */
  startLevel?: string
  /** Ejercicio que requiere aprobación de un profesional */
  caution?: CautionId
  /** Qué se hace en su lugar mientras no está aprobado */
  replacement?: Exercise
  /** Nombre del ejercicio original cuando este es un reemplazo elegido */
  swappedFrom?: string
  /** Bloque de la sesión (en la clase funcional: calentamiento, fuerza, estaciones, core) */
  block?: string
  /** Versión para cada una en los entrenos de a dos */
  partner?: { me: string; gime: string }
}

/** Ejercicio equivalente para cuando no se tiene el material (hereda series, reps y descanso) */
export type Alternative = {
  id: string
  name: string
  note?: string
  levelHint?: string
  perSide?: boolean
  /** Objetivo propio cuando difiere del original (ej: plancha en segundos en lugar de reps) */
  target?: Target
}

export type SessionId =
  | 'supA'
  | 'infA'
  | 'supB'
  | 'infB'
  | 'full'
  | 'mov'
  | 'core'
  | 'abs'
  | 'gime'
  | 'm2supA'
  | 'm2infA'
  | 'm2supB'
  | 'm2infB'

export type Session = {
  id: SessionId
  name: string
  estimate?: string
  exercises: Exercise[]
  /** Calentamiento propio (si no, el de la rutina) */
  warmup?: string[]
  /** Explicación breve de cómo se hace la sesión */
  intro?: string[]
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

/**
 * Entreno con Gime: clase de funcional para las dos, a intensidad moderada.
 * Cada una hace su versión. Para ti: sin saltos ni impacto, sin abdominales de
 * flexión (crunch, sit up) y con el cuello neutro, por el sacro y la cervical.
 */
const GIME_SESSION: Session = {
  id: 'gime',
  name: 'Funcional con Gime',
  estimate: '~55\'',
  intro: [
    'Clase de funcional para las dos, a la vez y cada una con su versión.',
    'Intensidad moderada: al terminar cada bloque deberíais poder hablar. Esfuerzo 6-7 de 10, nada al fallo.',
    'Los kilos son orientativos: subid o bajad según cómo os veáis.',
  ],
  warmup: [
    'Bici o remo suave 5\' (las dos)',
    '2 rondas: 10 sentadillas (tú a un banco) + 10 puentes de glúteo',
    'Movilidad: hombros, cadera y tobillos (1\')',
    '2 × 20" de plancha (tú con rodillas apoyadas)',
  ],
  exercises: [
    {
      id: 'alt-goblet',
      block: 'Bloque 1 · Fuerza (descanso 90" entre series)',
      name: 'Sentadilla goblet',
      sets: 3,
      target: { kind: 'reps', min: 10, max: 10 },
      rest: 90,
      levelHint: 'Peso (kg)',
      partner: {
        me: 'Mancuerna de 10-12 kg. Puedes bajar hasta tocar un banco.',
        gime: 'Mancuerna o kettlebell de 16-20 kg, sentadilla completa.',
      },
    },
    {
      id: 'alt-remo-mancuerna',
      block: 'Bloque 1 · Fuerza (descanso 90" entre series)',
      name: 'Remo con mancuerna a una mano (apoyo en banco)',
      sets: 3,
      target: { kind: 'reps', min: 10, max: 10, perSide: true },
      rest: 90,
      levelHint: 'Peso (kg)',
      partner: { me: '8-10 kg.', gime: '14-16 kg.' },
    },
    {
      id: 'gime-zancada',
      block: 'Bloque 2 · Estaciones: 3 × (40" trabajo / 20" descanso), 1\' para cambiar',
      name: 'Zancada hacia atrás alternando',
      sets: 3,
      target: { kind: 'seconds', min: 40, max: 40 },
      rest: 20,
      note: 'Paso atrás y bajar en vertical con el pecho arriba; volver empujando con el talón de la pierna de delante.',
      levelHint: 'Peso (kg)',
      partner: {
        me: 'Sin peso o mancuernas de 4-6 kg, paso corto y bajando hasta donde te sientas cómoda. Agárrate de algo si hace falta.',
        gime: 'Mancuernas de 10-12 kg, bajando hasta casi tocar el suelo con la rodilla.',
      },
    },
    {
      id: 'gime-pushup',
      block: 'Bloque 2 · Estaciones: 3 × (40" trabajo / 20" descanso), 1\' para cambiar',
      name: 'Flexiones',
      sets: 3,
      target: { kind: 'seconds', min: 40, max: 40 },
      rest: 20,
      note: 'Cuerpo en bloque y mirada al suelo (cuello neutro).',
      levelHint: 'Altura del apoyo',
      partner: {
        me: 'Inclinadas con las manos en un banco o la barra Smith a la altura de la cadera.',
        gime: 'Completas en el suelo; si van fáciles, con 2" de pausa abajo.',
      },
    },
    {
      id: 'gime-rdl',
      block: 'Bloque 2 · Estaciones: 3 × (40" trabajo / 20" descanso), 1\' para cambiar',
      name: 'Peso muerto rumano con mancuernas',
      sets: 3,
      target: { kind: 'seconds', min: 40, max: 40 },
      rest: 20,
      note: 'Lento: cadera atrás y espalda recta. Si notas el sacro, cambia a puente de glúteo.',
      levelHint: 'Peso (kg)',
      partner: {
        me: '6-8 kg en cada mano, bajando solo hasta debajo de las rodillas.',
        gime: '14-16 kg en cada mano, rango completo.',
      },
    },
    {
      id: 'gime-bici',
      block: 'Bloque 2 · Estaciones: 3 × (40" trabajo / 20" descanso), 1\' para cambiar',
      name: 'Bici de aire (o bici estática)',
      sets: 3,
      target: { kind: 'seconds', min: 40, max: 40 },
      rest: 20,
      partner: {
        me: 'Ritmo cómodo: tienes que poder hablar.',
        gime: 'Ritmo fuerte, sin llegar a esprintar.',
      },
    },
    {
      id: 'gime-granjero',
      block: 'Bloque 2 · Estaciones: 3 × (40" trabajo / 20" descanso), 1\' para cambiar',
      name: 'Paseo del granjero',
      sets: 3,
      target: { kind: 'seconds', min: 40, max: 40 },
      rest: 20,
      note: 'Caminar erguida con una mancuerna o kettlebell en cada mano, hombros abajo.',
      levelHint: 'Peso (kg)',
      partner: { me: '10-12 kg en cada mano.', gime: '20-24 kg en cada mano.' },
    },
    {
      id: 'gime-plancha-pareja',
      block: 'Bloque 3 · Core en pareja (2 rondas)',
      name: 'Plancha frente a frente chocando manos',
      sets: 2,
      target: { kind: 'seconds', min: 30, max: 30 },
      rest: 30,
      note: 'Una frente a la otra; chocáis la mano alternando, sin girar la cadera.',
      partner: { me: 'Con rodillas apoyadas.', gime: 'Plancha completa.' },
    },
    {
      id: 'gime-pallof',
      block: 'Bloque 3 · Core en pareja (2 rondas)',
      name: 'Pallof press en polea (o banda)',
      sets: 2,
      target: { kind: 'reps', min: 10, max: 10, perSide: true },
      rest: 30,
      note: 'De lado a la polea, empujar al frente y volver sin dejar que te gire.',
      levelHint: 'Peso (kg)',
      partner: { me: 'Peso ligero (2-5 kg en la polea).', gime: 'Más peso o más lejos de la polea.' },
    },
    {
      id: 'gime-dead-bug',
      block: 'Bloque 3 · Core en pareja (2 rondas)',
      name: 'Dead bug',
      sets: 2,
      target: { kind: 'reps', min: 8, max: 8, perSide: true },
      rest: 30,
      note: 'Espalda baja pegada al suelo todo el tiempo.',
      partner: { me: 'Brazo y pierna contrarios, rodilla doblada si hace falta.', gime: 'Con una mancuerna ligera en las manos.' },
    },
    {
      id: 'gime-calma',
      block: 'Vuelta a la calma',
      name: 'Estiramientos suaves 5\'',
      sets: 1,
      target: { kind: 'check', label: 'Hecho' },
      rest: 0,
      note: 'Cuádriceps, isquios, glúteo, pecho y espalda. Sin forzar el cuello.',
    },
  ],
}

/** Calentamiento de una sesión: el propio o el de la rutina */
export function warmupFor(id: SessionId) {
  return SESSIONS[id].warmup ?? WARMUP
}

export const SESSIONS: Record<SessionId, Session> = {
  // ─── Mes 2: mismos 4 días, sube la dificultad ───
  m2supA: {
    id: 'm2supA',
    name: 'Tren Superior A',
    estimate: '~50\'',
    exercises: [
      {
        id: 'pushup-inclinado',
        name: 'Push up inclinado, manos a 40 cm',
        sets: 3,
        target: { kind: 'reps', min: 8, max: 12 },
        rest: 90,
        note: 'Bajó de 50 cm a 40 cm. Cuerpo en línea, codos a 45°',
        levelHint: 'Altura del apoyo (ej: 40 cm)',
        startLevel: '40 cm',
      },
      {
        id: 'alt-remo-polea-ancho',
        name: 'Remo sentado en polea baja, agarre ancho',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 12 },
        rest: 90,
        note: 'Apretar omóplatos, sin encoger hombros',
        levelHint: 'Peso (kg)',
      },
      {
        id: 'alt-remo-mancuerna',
        name: 'Remo con mancuerna a una mano (apoyo en banco)',
        sets: 2,
        target: { kind: 'reps', min: 10, max: 12, perSide: true },
        rest: 90,
        note: 'Cuello alineado con la columna, mirada al piso',
        levelHint: 'Peso (kg)',
      },
      {
        id: 'alt-press-hombro-maquina',
        name: 'Press de hombro en máquina',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 12 },
        rest: 90,
        note: 'Respaldo apoyado',
        levelHint: 'Peso (kg)',
      },
      {
        id: 'plancha-inclinada',
        name: 'Plancha inclinada, manos en banco',
        sets: 3,
        target: { kind: 'seconds', min: 20, max: 30 },
        rest: 60,
        note: 'Reemplaza la plancha de rodillas',
        levelHint: 'Apoyo (ej: banco, escalón, suelo)',
        startLevel: 'manos en banco',
      },
      {
        id: 'superman',
        name: 'Superman suave',
        sets: 2,
        target: { kind: 'reps', min: 10, max: 10 },
        rest: 60,
        note: 'Pausa 2" arriba, subir poco, mirada al piso',
      },
    ],
  },
  m2infA: {
    id: 'm2infA',
    name: 'Tren Inferior A',
    estimate: '~50\'',
    exercises: [
      {
        id: 'prensa',
        name: 'Prensa de piernas',
        sets: 3,
        target: { kind: 'reps', min: 12, max: 15 },
        rest: 90,
        note: 'Rango cómodo, rodillas siguen la línea de los pies',
        levelHint: 'Peso (kg)',
      },
      {
        id: 'puente-gluteo',
        name: 'Puente de glúteo con pausa',
        sets: 3,
        target: { kind: 'reps', min: 12, max: 15 },
        rest: 90,
        note: 'Pausa 2" arriba. Con disco o mancuerna liviana sobre la cadera solo si no hay molestia en sacro',
        levelHint: 'Carga (ej: sin peso, disco 5 kg)',
      },
      {
        id: 'zancada-estatica',
        name: 'Zancada estática con apoyo de silla',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 10, perSide: true },
        rest: 90,
        note: 'Era 2 series',
        levelHint: 'Asistencia (ej: con silla, sin apoyo)',
      },
      {
        id: 'alt-curl-femoral-sentado',
        name: 'Curl femoral en máquina',
        sets: 3,
        target: { kind: 'reps', min: 12, max: 12 },
        rest: 60,
        note: 'Mantener el peso hasta completar 3 x 12',
        levelHint: 'Peso (kg)',
      },
      {
        id: 'pantorrilla-a',
        name: 'Pantorrilla de pie',
        sets: 3,
        target: { kind: 'reps', min: 15, max: 20 },
        rest: 45,
        note: 'Pausa 1" arriba',
        levelHint: 'Variante (ej: sin peso, mancuerna, a una pierna)',
      },
      walking('caminata-a', 10, 10, 'Ritmo en que se pueda hablar'),
    ],
  },
  m2supB: {
    id: 'm2supB',
    name: 'Tren Superior B',
    estimate: '~45\'',
    exercises: [
      {
        id: 'pushup-rodillas',
        name: 'Push up de rodillas, bajada de 3"',
        sets: 3,
        target: { kind: 'reps', min: 8, max: 12 },
        rest: 90,
        note: 'Misma variante, más lenta',
        levelHint: 'Variante (ej: bajada 3", pausa 1" abajo)',
        startLevel: 'bajada 3"',
      },
      {
        id: 'alt-remo-polea-ancho',
        name: 'Remo con agarre ancho (polea baja)',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 12 },
        rest: 90,
        levelHint: 'Peso (kg)',
      },
      {
        id: 'alt-press-hombro-maquina',
        name: 'Press de hombro en máquina',
        sets: 2,
        target: { kind: 'reps', min: 10, max: 12 },
        rest: 90,
        levelHint: 'Peso (kg)',
      },
      {
        id: 'dead-bug',
        name: 'Dead bug',
        sets: 3,
        target: { kind: 'reps', min: 12, max: 12, perSide: true },
        rest: 60,
        note: 'Lento, zona lumbar apoyada en el piso',
      },
      {
        id: 'alt-triceps-polea',
        name: 'Extensión de tríceps en polea alta',
        sets: 3,
        target: { kind: 'reps', min: 12, max: 12 },
        rest: 60,
        note: 'Era 2 series',
        levelHint: 'Peso (kg)',
      },
    ],
  },
  m2infB: {
    id: 'm2infB',
    name: 'Tren Inferior B',
    estimate: '~50\'',
    exercises: [
      {
        id: 'alt-goblet',
        name: 'Sentadilla goblet con mancuerna liviana o mochila',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 12 },
        rest: 90,
        note: 'Reemplaza la sentadilla asistida, ya hecha sin apoyo',
        levelHint: 'Peso (kg)',
      },
      {
        id: 'rdl-una-pierna',
        name: 'Peso muerto rumano a una pierna asistido (mano en pared)',
        sets: 3,
        target: { kind: 'reps', min: 8, max: 8, perSide: true },
        rest: 90,
        note: 'Espalda neutra, bajar solo hasta donde la espalda lo permita',
        levelHint: 'Apoyo (ej: mano en pared, dedos, sin apoyo)',
        startLevel: 'mano en pared',
      },
      {
        id: 'step-up',
        name: 'Step-up en escalón bajo',
        sets: 3,
        target: { kind: 'reps', min: 10, max: 10, perSide: true },
        rest: 90,
        levelHint: 'Altura del escalón',
      },
      {
        id: 'puente-una-pierna',
        name: 'Puente de glúteo a una pierna',
        sets: 3,
        target: { kind: 'reps', min: 8, max: 8, perSide: true },
        rest: 60,
        note: 'Era 2 series',
      },
      {
        id: 'extension-cuadriceps',
        name: 'Extensión de cuádriceps en máquina',
        sets: 2,
        target: { kind: 'reps', min: 12, max: 15 },
        rest: 60,
        note: 'Si no hay máquina, repetir sentadilla goblet con pausa de 2" abajo',
        levelHint: 'Peso (kg)',
      },
      {
        id: 'pantorrilla-b',
        name: 'Pantorrilla de pie',
        sets: 3,
        target: { kind: 'reps', min: 15, max: 20 },
        rest: 45,
        levelHint: 'Variante (ej: sin peso, mancuerna, a una pierna)',
      },
      walking('caminata-b', 10, 10, ''),
    ],
  },
  gime: GIME_SESSION,
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

export type ProgramId = 'm1' | 'm2'

/** Orden y días por defecto de un plan semanal */
export type WeekPlanDef = { label: string; order: SessionId[]; schedule: DayPlan[] }

export const M2_ORDER: SessionId[] = ['m2supA', 'm2infA', 'm2supB', 'm2infB']

const M2_SCHEDULE: DayPlan[] = [
  { restLabel: 'Descanso, caminata ligera opcional' },
  { session: 'm2supA' },
  { session: 'm2infA' },
  { restLabel: 'Descanso o caminata 20\'' },
  { session: 'm2supB' },
  { session: 'm2infB' },
  { restLabel: 'Descanso, caminata ligera opcional' },
]

export const PROGRAM_NAMES: Record<ProgramId, { name: string; description: string }> = {
  m1: { name: 'Mes 1', description: 'Rutina principiante: Fase 1 (4 días) y Fase 2 (5-6 días)' },
  m2: { name: 'Mes 2', description: '4 días, 4 semanas: mismos días, sube la dificultad' },
}

/** Programa que se usa si no se eligió otro */
export const DEFAULT_PROGRAM: ProgramId = 'm2'

/** Plan semanal según programa (y fase, en el Mes 1) */
export function weekPlanFor(program: ProgramId, phase: 1 | 2): WeekPlanDef {
  if (program === 'm2') return { label: 'Mes 2', order: M2_ORDER, schedule: M2_SCHEDULE }
  return { label: `Fase ${phase}`, order: PHASE_ORDER[phase], schedule: SCHEDULE[phase] }
}

/** Mes 2: qué hacer cada semana (la semana 4 la app recorta a 2 series) */
export const M2_WEEKS = [
  'Empezar con los niveles nuevos. Dejar 2-3 repeticiones en reserva en cada serie.',
  'Completar todos los rangos. Si todas las series llegan al tope de reps, subir un nivel.',
  'Mismo trabajo con bajada lenta de 3" en push up, sentadilla y step-up.',
  'Descarga: 2 series por ejercicio, mismas cargas.',
]

export const M2_NOTES = {
  out: 'Fuera de la rutina por ahora: pike push up y ejercicios de flexión de columna (crunch, abdominales). Core con plancha y dead bug.',
  warning: 'Si aparece dolor en sacro o cuello (no agujetas), parar el ejercicio y avisar.',
  functional:
    'Clase de funcional (opcional): máximo 1 por semana, en miércoles o sábado. No el día anterior a una sesión de tren inferior.',
}

export const M2_PROGRESSIONS = [
  'Regla: cuando todas las series llegan al tope del rango con buena técnica y sin dolor, pasar al siguiente nivel. Un cambio por vez.',
  'Push up inclinado: 50 cm → 40 cm → 30 cm → 20 cm.',
  'Push up de rodillas: bajada lenta de 3" → pausa de 1" abajo → push up inclinado bajo.',
  'Plancha: inclinada con manos en banco → manos en escalón → en suelo.',
  'Sentadilla: goblet con mancuerna liviana → subir de a poco la carga cuando salgan 3 x 12 con 2-3 repeticiones en reserva.',
  'Remo y press de hombro: subir carga cuando todas las series lleguen a 12.',
  'Curl femoral en máquina: sostener la carga hasta 3 x 12, después subir.',
  'Pantorrilla: 3 x 20 → con mancuerna liviana → a una pierna con apoyo.',
  'Puente de glúteo: bipodal con pausa → con carga liviana → a una pierna.',
  'Peso muerto rumano a una pierna: con mano en pared → con dedos en pared → sin apoyo.',
  'Dead bug: 3 x 12 por lado → pausa de 2" con brazos y piernas extendidos.',
]

export const M2_START = [
  'Push up inclinado, 50 cm: 12 x 3',
  'Push up de rodillas: 12 x 3',
  'Sentadilla sin apoyo: 15 x 3',
  'Puente de glúteo: 15 x 3',
  'Zancada estática con apoyo: 10 x 2 por pierna',
  'Pantorrilla de pie: 20 x 2',
  'Curl femoral en máquina (25): 12 / 12 / 8',
  'Remo con mancuerna (8): 10 / 12 / 10 por lado',
  'Remo en polea baja agarre ancho (20/30/30): 12 / 12 / 10',
  'Press de hombro en máquina (10): 12 x 2',
  'Extensión de tríceps en polea alta (12): 12 x 2',
  'Plancha con rodillas: 30" x 3',
  'Dead bug: 10 por lado x 3',
]

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
export function planWeek(def: WeekPlanDef, days?: number[]): DayPlan[] {
  if (!days) return def.schedule
  const plan: DayPlan[] = Array.from({ length: 7 }, () => ({ restLabel: REST_CUSTOM }))
  // La semana empieza el lunes: L M X J V S D
  const sorted = [...days].sort((a, b) => ((a + 6) % 7) - ((b + 6) % 7))
  sorted.slice(0, def.order.length).forEach((d, i) => (plan[d] = { session: def.order[i] }))
  return plan
}

/** Sesiones del plan que no entran en los días elegidos */
export function missingSessions(def: WeekPlanDef, days?: number[]) {
  if (!days) return []
  return def.order.slice(days.length)
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
  gobletPausa: {
    id: 'alt-goblet-pausa',
    name: 'Sentadilla goblet con pausa de 2" abajo',
    note: 'Si no hay máquina de extensión de cuádriceps',
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
  prensa: { group: 'prensa', options: [ALT.goblet] },
  'extension-cuadriceps': { group: 'extension-cuadriceps', options: [ALT.gobletPausa] },
  'caminata-a': { group: 'caminata', options: cardioOptions },
  'caminata-b': { group: 'caminata', options: cardioOptions },
  'full-caminata': { group: 'caminata', options: cardioOptions },
  'mov-caminata': { group: 'caminata', options: cardioOptions },
}

/**
 * Ejercicios de core que se pueden cambiar por cualquiera de los del core diario.
 * Este cambio vale solo para la sesión en curso: no se guarda.
 */
export const CORE_GROUP = 'core'
const CORE_SLOTS = new Set(['dead-bug', 'plancha-rodillas', 'plancha-inclinada', ...CORE_EXERCISES.map((c) => c.id)])

/** Elección del usuario por grupo: id de la alternativa */
export type Swaps = Record<string, string>

function toExercise(slot: Exercise, alt: Alternative): Exercise {
  const target = alt.target ?? (alt.perSide && slot.target.kind === 'reps' ? { ...slot.target, perSide: true } : slot.target)
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
  if (CORE_SLOTS.has(slot.id)) {
    const others = CORE_EXERCISES.filter((c) => c.name !== slot.name && c.id !== slot.id)
    return {
      group: CORE_GROUP,
      options: [
        slot,
        ...others.map((c) =>
          toExercise(slot, { id: c.id, name: c.name, note: c.note, levelHint: c.levelHint, target: c.target }),
        ),
      ],
    }
  }
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
  const { slots } = resolveExercises(session, approvals)
  // Primero el ejercicio tal cual (en el core diario todos son a la vez original y alternativa)
  const exact = slots.find((s) => s.id === exerciseId)
  if (exact) return { slot: exact, exercise: exact, swap: swapOptions(exact) }
  for (const slot of slots) {
    const sw = swapOptions(slot)
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
      return `${sets} x ${t.min === t.max ? t.min : `${t.min}-${t.max}`}"`
    case 'minutes':
      return `${t.min === t.max ? t.min : `${t.min}-${t.max}`}'`
    case 'check':
      return t.label === 'Hecho' ? '' : t.label
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
  prensa: { folder: 'Leg_Press' },
  'extension-cuadriceps': { folder: 'Leg_Extensions' },
  'alt-goblet-pausa': { folder: 'Goblet_Squat' },
  'plancha-inclinada': { folder: 'Plank', note: 'La imagen muestra la plancha en el suelo; tú con las manos en un banco.' },
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
  'gime-zancada': { folder: 'Dumbbell_Rear_Lunge' },
  'gime-pushup': { folder: 'Pushups', note: 'Tú las haces inclinadas, con las manos en un banco.' },
  'gime-rdl': { folder: 'Stiff-Legged_Dumbbell_Deadlift', note: 'Rodillas un poco flexionadas, como en el rumano.' },
  'gime-bici': { folder: 'Air_Bike' },
  'gime-granjero': { folder: 'Farmers_Walk' },
  'gime-plancha-pareja': { folder: 'Plank' },
  'gime-pallof': { folder: 'Pallof_Press' },
  'gime-dead-bug': { folder: 'Dead_Bug' },
}
