// Explicación breve de cada ejercicio + búsqueda de video en YouTube

export type HowTo = {
  steps: string[]
  /** Texto a buscar en YouTube */
  video: string
}

const pushupInclinado: HowTo = {
  steps: [
    'Apoya las manos en el borde de una mesa o silla firme, un poco más abiertas que los hombros.',
    'Lleva los pies atrás hasta que el cuerpo quede en línea recta de cabeza a talones.',
    'Baja el pecho hacia el borde doblando los codos (a unos 45° del cuerpo, no abiertos en cruz).',
    'Empuja hasta estirar los brazos. Mirada hacia el apoyo, cuello alineado con la espalda.',
  ],
  video: 'flexiones inclinadas principiantes técnica',
}

const remoBanda: HowTo = {
  steps: [
    'De pie, pisa el centro de la banda con ambos pies y toma un extremo en cada mano.',
    'Inclina el tronco levemente hacia adelante con la espalda recta y rodillas un poco flexionadas.',
    'Tira de la banda hacia la cintura llevando los codos hacia atrás, pegados al cuerpo.',
    'Aprieta los omóplatos 1 segundo y vuelve despacio.',
  ],
  video: 'remo con banda elástica de pie técnica',
}

const pressHombro: HowTo = {
  steps: [
    'De pie, pisa la banda y toma los extremos a la altura de los hombros, palmas hacia adelante.',
    'Aprieta el abdomen y los glúteos para no arquear la espalda baja.',
    'Empuja hacia arriba hasta casi estirar los brazos, sin adelantar la cabeza.',
    'Baja despacio hasta los hombros.',
  ],
  video: 'press de hombro con banda elástica de pie',
}

const sentadillaAsistida: HowTo = {
  steps: [
    'De pie frente a una silla firme o un marco de puerta, tómalo con las manos.',
    'Pies al ancho de hombros, puntas un poco hacia afuera.',
    'Baja llevando la cadera atrás como si fueras a sentarte, hasta donde sea cómodo.',
    'Sube empujando el suelo con todo el pie. Usa las manos solo lo necesario.',
  ],
  video: 'sentadilla asistida con silla principiantes',
}

const pantorrilla: HowTo = {
  steps: [
    'De pie, pies al ancho de caderas. Apóyate en una silla o pared si lo necesitas.',
    'Sube en puntas de pie lo más alto que puedas.',
    'Mantén 1 segundo arriba y baja despacio, sin rebotar.',
  ],
  video: 'elevación de pantorrillas de pie sin peso',
}

const caminata: HowTo = {
  steps: [
    'Camina a un ritmo en el que te cueste un poco, pero puedas hablar.',
    'Postura erguida, brazos sueltos acompañando el paso.',
    'Si aparece dolor (no cansancio), baja el ritmo o termina.',
  ],
  video: 'caminata de bajo impacto técnica postura',
}

export const HOWTO: Record<string, HowTo> = {
  'pushup-inclinado': pushupInclinado,
  'full-pushup-inclinado': pushupInclinado,
  'remo-banda': remoBanda,
  'full-remo-banda': remoBanda,
  'remo-banda-ancho': {
    steps: [
      'Igual que el remo con banda de Superior A, pero tomando la banda más abierta (manos más separadas).',
      'Tira llevando los codos hacia afuera y atrás, a la altura del pecho bajo.',
      'Aprieta los omóplatos 1 segundo y vuelve despacio.',
    ],
    video: 'remo con banda elástica agarre ancho',
  },
  'press-hombro-banda': pressHombro,
  'press-hombro-banda-extra': pressHombro,
  'plancha-rodillas': {
    steps: [
      'Apoya antebrazos (codos bajo los hombros) y rodillas en el suelo.',
      'Lleva las caderas hasta que rodillas, cadera y hombros queden en línea.',
      'Aprieta abdomen y glúteos. No dejes caer la cadera ni levantes la cola.',
      'Mirada al suelo, cuello neutro. Respira normal mientras mantienes.',
    ],
    video: 'plancha con rodillas apoyadas principiantes',
  },
  superman: {
    steps: [
      'Boca abajo, brazos estirados hacia adelante y piernas estiradas.',
      'Eleva suavemente brazos y piernas unos centímetros del suelo.',
      'Mantén 1-2 segundos y baja despacio. Mirada al suelo, sin levantar la cabeza.',
      'Solo si fue aprobado por el profesional.',
    ],
    video: 'ejercicio superman lumbar suave principiantes',
  },
  'sentadilla-asistida': sentadillaAsistida,
  'full-sentadilla-asistida': sentadillaAsistida,
  'puente-gluteo': {
    steps: [
      'Boca arriba, rodillas dobladas y pies apoyados al ancho de caderas.',
      'Empuja con los talones y sube la cadera hasta que rodillas, cadera y hombros queden en línea.',
      'Aprieta los glúteos 1-2 segundos arriba, sin arquear la espalda baja.',
      'Baja despacio.',
    ],
    video: 'puente de glúteo en el suelo técnica principiantes',
  },
  'zancada-estatica': {
    steps: [
      'Párate al lado de una silla y apóyate con una mano.',
      'Da un paso largo: una pierna adelante y otra atrás. Los pies se quedan fijos.',
      'Baja doblando ambas rodillas, tronco erguido, hasta donde sea cómodo.',
      'Sube y repite. Haz todas las reps de una pierna y luego cambia.',
    ],
    video: 'zancada estática split squat con apoyo principiantes',
  },
  'pantorrilla-a': pantorrilla,
  'pantorrilla-b': pantorrilla,
  'curl-femoral-banda': {
    steps: [
      'Ata la banda a algo fijo y bajo (pata de un mueble pesado).',
      'Acuéstate boca abajo y pasa la banda por detrás de los tobillos.',
      'Dobla las rodillas llevando los talones hacia los glúteos, contra la resistencia.',
      'Vuelve despacio. La cadera se queda pegada al suelo.',
    ],
    video: 'curl femoral con banda elástica acostado boca abajo',
  },
  'caminata-a': caminata,
  'caminata-b': caminata,
  'full-caminata': caminata,
  'mov-caminata': caminata,
  'pushup-rodillas': {
    steps: [
      'Apoya manos (un poco más abiertas que los hombros) y rodillas en el suelo.',
      'Lleva las caderas hasta que rodillas, cadera y hombros queden en línea.',
      'Baja el pecho hacia el suelo doblando los codos (a unos 45° del cuerpo).',
      'Empuja hasta estirar los brazos. Mirada al suelo, cuello neutro.',
    ],
    video: 'flexiones de rodillas principiantes técnica',
  },
  'pike-pushup': {
    steps: [
      'Manos en el suelo y pies atrás, cadera alta formando una "V" invertida; rodillas algo flexionadas.',
      'Dobla los codos y baja la cabeza suavemente hacia el suelo, entre las manos.',
      'Empuja para volver. Movimiento muy suave y corto.',
      'Solo si fue aprobado por el profesional (posición de cuello).',
    ],
    video: 'pike push up principiantes',
  },
  'dead-bug': {
    steps: [
      'Boca arriba, brazos estirados hacia el techo y rodillas dobladas a 90° en el aire.',
      'Pega la espalda baja al suelo y mantenla así todo el ejercicio.',
      'Estira un brazo hacia atrás y la pierna contraria hacia adelante, despacio.',
      'Vuelve al centro y cambia de lado.',
    ],
    video: 'dead bug ejercicio core principiantes',
  },
  'triceps-banda': {
    steps: [
      'Pisa un extremo de la banda y toma el otro con ambas manos detrás de la cabeza.',
      'Codos apuntando hacia arriba y cerca de la cabeza.',
      'Estira los brazos hacia arriba sin mover los codos.',
      'Baja despacio. Mantén el cuello neutro, sin empujar la cabeza hacia adelante.',
    ],
    video: 'extensión de tríceps con banda elástica',
  },
  'sentadilla-peso': {
    steps: [
      'Si usas carga, ponte una mochila con libros bien ajustada a la espalda.',
      'Pies al ancho de hombros, puntas un poco hacia afuera.',
      'Baja llevando la cadera atrás, pecho arriba, hasta donde sea cómodo.',
      'Sube empujando el suelo con todo el pie.',
    ],
    video: 'sentadilla con mochila en casa técnica',
  },
  'rdl-una-pierna': {
    steps: [
      'De pie junto a una pared, apoya una mano en ella.',
      'Con la rodilla de apoyo un poco flexionada, inclina el tronco hacia adelante mientras la otra pierna va hacia atrás.',
      'Espalda recta, baja solo hasta sentir estirar la parte de atrás del muslo.',
      'Vuelve apretando el glúteo. Solo si fue aprobado por el profesional.',
    ],
    video: 'peso muerto rumano a una pierna con apoyo en pared',
  },
  'step-up': {
    steps: [
      'Ponte frente a un escalón bajo y estable.',
      'Apoya un pie completo arriba y sube empujando con esa pierna.',
      'Baja despacio con la misma pierna que subió primero.',
      'Haz todas las reps de una pierna y luego cambia.',
    ],
    video: 'step up en escalón principiantes',
  },
  'puente-una-pierna': {
    steps: [
      'Boca arriba, rodillas dobladas. Estira una pierna o llévala hacia el pecho.',
      'Empuja con el talón de la pierna apoyada y sube la cadera.',
      'Mantén la cadera nivelada (que no se caiga hacia un lado).',
      'Baja despacio. Haz todas las reps y cambia de pierna.',
    ],
    video: 'puente de glúteo a una pierna técnica',
  },
  'movilidad-general': {
    steps: [
      'Tobillos: círculos y llevar la rodilla hacia adelante con el pie apoyado.',
      'Caderas: círculos de cadera y balanceos suaves de pierna.',
      'Hombros: círculos de brazos hacia adelante y atrás.',
      'Movimientos lentos, sin dolor. Evita forzar el cuello.',
    ],
    video: 'rutina de movilidad articular general principiantes',
  },
}

export function youtubeSearch(query: string) {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`
}
