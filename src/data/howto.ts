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
  'gime-zancada': {
    steps: [
      'De pie, pies al ancho de la cadera (con mancuernas a los lados si usas peso).',
      'Da un paso largo hacia atrás y baja en vertical hasta que las dos rodillas queden a unos 90°.',
      'Pecho arriba y rodilla de delante en línea con el pie.',
      'Empuja con el talón de la pierna de delante para volver y cambia de pierna.',
    ],
    video: 'zancada hacia atrás con mancuernas técnica',
  },
  'gime-pushup': {
    steps: [
      'Manos un poco más abiertas que los hombros; cuerpo recto de la cabeza a los pies (o a las rodillas).',
      'Baja el pecho hacia el apoyo con los codos a unos 45° del cuerpo.',
      'Empuja hasta estirar los brazos sin hundir la cadera. Mirada al suelo.',
    ],
    video: 'flexiones inclinadas en banco técnica',
  },
  'gime-rdl': {
    steps: [
      'De pie con una mancuerna en cada mano delante de los muslos, rodillas un poco flexionadas.',
      'Lleva la cadera hacia atrás bajando las mancuernas pegadas a las piernas, espalda recta.',
      'Baja hasta notar estiramiento detrás de los muslos y sube apretando el glúteo.',
    ],
    video: 'peso muerto rumano con mancuernas técnica',
  },
  'gime-bici': {
    steps: [
      'Ajusta el asiento: rodilla casi estirada abajo.',
      'Pedalea empujando también con los brazos (en la bici de aire).',
      'Mantén el ritmo que te toca durante los 40".',
    ],
    video: 'bici de aire assault bike técnica',
  },
  'gime-granjero': {
    steps: [
      'Agarra una pesa en cada mano con los brazos estirados a los lados.',
      'Camina con pasos cortos, espalda erguida, hombros abajo y abdomen firme.',
      'Deja las pesas flexionando las rodillas, no la espalda.',
    ],
    video: 'paseo del granjero farmer walk técnica',
  },
  'gime-plancha-pareja': {
    steps: [
      'Poneos en plancha una frente a la otra, a un brazo de distancia.',
      'Levanta una mano y chócala con la de tu compañera, sin girar la cadera.',
      'Alterna manos durante todo el tiempo.',
    ],
    video: 'plancha en pareja chocando manos',
  },
  'gime-pallof': {
    steps: [
      'De lado a la polea a la altura del pecho, agarre con las dos manos pegado al esternón.',
      'Empuja las manos al frente hasta estirar los brazos sin dejar que el cuerpo gire.',
      'Aguanta 1" y vuelve. Haz las repeticiones de un lado y cambia.',
    ],
    video: 'pallof press polea técnica',
  },
  'gime-dead-bug': {
    steps: [
      'Boca arriba, brazos estirados hacia el techo y rodillas dobladas a 90° en el aire.',
      'Pega la espalda baja al suelo y mantenla así todo el ejercicio.',
      'Estira un brazo hacia atrás y la pierna contraria hacia adelante, despacio.',
    ],
    video: 'dead bug ejercicio core',
  },
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
  'alt-remo-mancuerna': {
    steps: [
      'Apoya una rodilla y la mano del mismo lado en un banco, espalda plana y paralela al suelo.',
      'Con la otra mano tira de la mancuerna hacia la cadera, codo pegado al cuerpo.',
      'Aprieta el omóplato 1 segundo y baja despacio. Todas las reps y cambia de lado.',
    ],
    video: 'remo con mancuerna a una mano apoyo en banco técnica',
  },
  'alt-remo-polea': {
    steps: [
      'Sentada en la máquina de polea baja, pies apoyados y rodillas un poco flexionadas.',
      'Espalda recta (sin echarte atrás); tira del agarre hacia el abdomen llevando los codos atrás.',
      'Aprieta los omóplatos y vuelve despacio estirando los brazos sin encorvarte.',
    ],
    video: 'remo sentado en polea baja técnica principiantes',
  },
  'alt-remo-polea-ancho': {
    steps: [
      'Sentada en la polea baja con una barra recta, manos más abiertas que los hombros.',
      'Espalda recta; tira de la barra hacia la parte baja del pecho llevando los codos hacia afuera y atrás.',
      'Aprieta los omóplatos y vuelve despacio.',
    ],
    video: 'remo en polea baja agarre ancho técnica',
  },
  'alt-press-hombro-mancuernas': {
    steps: [
      'Sentada en un banco con respaldo vertical, espalda apoyada completa.',
      'Mancuernas a la altura de los hombros, palmas hacia adelante.',
      'Empuja hacia arriba sin chocar las mancuernas, cabeza quieta y mirada al frente.',
      'Baja controlado hasta los hombros. Empieza con poco peso.',
    ],
    video: 'press de hombro con mancuernas sentado con respaldo principiantes',
  },
  'alt-press-hombro-maquina': {
    steps: [
      'Ajusta el asiento para que los agarres queden a la altura de los hombros.',
      'Espalda apoyada en el respaldo; empuja hacia arriba hasta casi estirar los brazos.',
      'Baja despacio. No adelantes la cabeza.',
    ],
    video: 'press de hombro en máquina técnica',
  },
  'alt-curl-femoral-sentado': {
    steps: [
      'Ajusta la máquina: el rodillo de abajo detrás de los tobillos y el de arriba sobre los muslos.',
      'Espalda apoyada en el respaldo; dobla las rodillas llevando los talones hacia abajo y atrás.',
      'Vuelve despacio sin dejar caer el peso.',
    ],
    video: 'curl femoral sentado en máquina técnica',
  },
  'alt-curl-femoral-tumbado': {
    steps: [
      'Boca abajo en la máquina, rodillas justo fuera del borde del banco y rodillo sobre los tobillos.',
      'Cadera pegada al banco: dobla las rodillas llevando los talones hacia los glúteos.',
      'Baja despacio. Si arqueas la espalda baja, reduce el peso.',
    ],
    video: 'curl femoral tumbado en máquina técnica',
  },
  'alt-triceps-polea': {
    steps: [
      'De pie frente a la polea alta, toma la barra o cuerda con los codos pegados al cuerpo.',
      'Empuja hacia abajo hasta estirar los brazos; solo se mueven los antebrazos.',
      'Vuelve despacio hasta que los antebrazos queden paralelos al suelo.',
    ],
    video: 'extensión de tríceps en polea alta técnica',
  },
  'alt-triceps-mancuerna': {
    steps: [
      'Tumbada boca arriba en un banco, con la cabeza apoyada. Una mancuerna en cada mano, brazos estirados hacia el techo.',
      'Dobla solo los codos bajando las mancuernas a los lados de la cabeza.',
      'Estira los brazos de nuevo sin mover los codos. Empieza con poco peso.',
    ],
    video: 'extensión de tríceps con mancuernas tumbado en banco',
  },
  'alt-goblet': {
    steps: [
      'Sostén una mancuerna o kettlebell pegada al pecho con ambas manos.',
      'Pies al ancho de hombros; baja llevando la cadera atrás, pecho arriba, hasta donde sea cómodo.',
      'Sube empujando el suelo con todo el pie.',
    ],
    video: 'sentadilla goblet principiantes técnica',
  },
  'alt-cinta': {
    steps: [
      'Velocidad en la que te cueste un poco pero puedas hablar (por ejemplo 5-6 km/h).',
      'Sin inclinación al principio; no te sostengas de las barras.',
      'Si aparece dolor (no cansancio), baja el ritmo o termina.',
    ],
    video: 'caminar en cinta principiantes postura',
  },
  'alt-bici': {
    steps: [
      'Ajusta el asiento: con el pedal abajo, la rodilla queda apenas flexionada.',
      'Espalda erguida, resistencia baja-moderada; pedalea a un ritmo en el que puedas hablar.',
      'Si notas molestia lumbar, prueba una bici con respaldo (reclinada).',
    ],
    video: 'bicicleta estática principiantes postura ajuste asiento',
  },
  'alt-eliptica': {
    steps: [
      'Sube y toma las manillas; espalda erguida y mirada al frente.',
      'Resistencia baja-moderada, a un ritmo en el que puedas hablar.',
      'Empuja con todo el pie, sin despegar los talones.',
    ],
    video: 'elíptica cómo usarla principiantes',
  },
  'core-bird-dog': {
    steps: [
      'En cuadrupedia: manos bajo los hombros, rodillas bajo la cadera, espalda plana.',
      'Estira a la vez un brazo hacia adelante y la pierna contraria hacia atrás, a la altura del cuerpo.',
      'Mantén 2 segundos sin que la cadera gire ni la espalda se hunda, y vuelve. Alterna lados.',
      'Mirada al suelo, cuello alineado con la espalda.',
    ],
    video: 'bird dog ejercicio core técnica principiantes',
  },
  'core-dead-bug': {
    steps: [
      'Boca arriba, brazos estirados hacia el techo y rodillas dobladas a 90° en el aire.',
      'Pega la espalda baja al suelo y mantenla así todo el ejercicio.',
      'Estira un brazo hacia atrás y la pierna contraria hacia adelante, despacio, y vuelve. Alterna lados.',
      'La cabeza queda apoyada en el suelo.',
    ],
    video: 'dead bug ejercicio core principiantes',
  },
  'core-plancha-rodillas': {
    steps: [
      'Apoya antebrazos (codos bajo los hombros) y rodillas en el suelo.',
      'Lleva las caderas hasta que rodillas, cadera y hombros queden en línea.',
      'Aprieta abdomen y glúteos, sin dejar caer la cadera. Respira normal.',
    ],
    video: 'plancha con rodillas apoyadas principiantes',
  },
  'core-plancha-lateral': {
    steps: [
      'De lado, apoya el antebrazo con el codo bajo el hombro y las rodillas dobladas una sobre otra.',
      'Sube la cadera hasta que rodillas, cadera y hombros queden en línea.',
      'Mantén el tiempo indicado y cambia de lado. Cabeza alineada, sin dejarla caer.',
    ],
    video: 'plancha lateral con rodillas apoyadas principiantes',
  },
  'core-transverso': {
    steps: [
      'Boca arriba con las rodillas dobladas y los pies apoyados. Manos sobre el abdomen bajo.',
      'Toma aire por la nariz y, al soltarlo, mete el ombligo hacia adentro como cerrando un cinturón.',
      'Mantén 3-5 segundos respirando suave, sin mover la espalda ni la pelvis, y relaja.',
    ],
    video: 'activación del transverso abdominal acostado',
  },
  'abs-abrir-cerrar': {
    steps: [
      'Sentada en la colchoneta, manos apoyadas detrás de la cadera y tronco inclinado hacia atrás con la espalda recta. Dos mancuernas en el suelo frente a ti, como obstáculo.',
      'Con los pies en el aire, abre las piernas por fuera de las mancuernas.',
      'Recoge las rodillas hacia el pecho y vuelve a bajar con las piernas juntas en el centro. Eso es 1 repetición.',
      'Abdomen apretado y espalda baja estable: si se arquea o molesta el sacro, para.',
    ],
    video: 'seated leg raise open close over dumbbells abs',
  },
  'abs-lado-lado': {
    steps: [
      'Sentada en la colchoneta, manos apoyadas detrás de la cadera y tronco inclinado hacia atrás con la espalda recta. Dos mancuernas en el suelo frente a ti, como obstáculo.',
      'Con las piernas juntas y los pies en el aire, pásalas por encima de la mancuerna de un lado al otro.',
      'Cada pasada cuenta 1. Gira desde la cintura sin mover los hombros.',
    ],
    video: 'seated leg raise side to side over dumbbell obliques',
  },
  'abs-rodillas-diagonal': {
    steps: [
      'Sentada en la colchoneta, manos apoyadas detrás de la cadera y tronco inclinado hacia atrás con la espalda recta. Dos mancuernas en el suelo frente a ti, como obstáculo.',
      'Recoge las rodillas hacia el pecho.',
      'Estira las piernas en diagonal hacia un lado, bajas pero sin tocar el suelo, y vuelve a recoger.',
      'Alterna el lado en cada repetición.',
    ],
    video: 'seated knee tuck diagonal leg extension abs',
  },
  'abs-barrido-bajo': {
    steps: [
      'Sentada en la colchoneta, manos apoyadas detrás de la cadera y tronco inclinado hacia atrás con la espalda recta. Dos mancuernas en el suelo frente a ti, como obstáculo.',
      'Con las piernas juntas, cerca del suelo y las rodillas un poco dobladas, barre de un lado al otro de la mancuerna.',
      'Movimiento controlado, sin impulso. Cada pasada cuenta 1.',
    ],
    video: 'seated low leg sweeps side to side abs dumbbell',
  },
  prensa: {
    steps: [
      'Siéntate con la espalda y la cadera bien apoyadas en el respaldo; pies al ancho de caderas en la plataforma.',
      'Baja la plataforma doblando las rodillas en un rango cómodo, sin que la cadera se despegue del asiento.',
      'Empuja hasta casi estirar las piernas, sin bloquear las rodillas. Rodillas en la línea de los pies.',
    ],
    video: 'prensa de piernas técnica principiantes',
  },
  'extension-cuadriceps': {
    steps: [
      'Ajusta la máquina: rodilla alineada con el eje y el rodillo sobre los tobillos. Espalda apoyada.',
      'Estira las piernas hasta arriba y aprieta el cuádriceps 1".',
      'Baja despacio sin dejar caer el peso.',
    ],
    video: 'extensión de cuádriceps en máquina técnica',
  },
  'alt-goblet-pausa': {
    steps: [
      'Mancuerna pegada al pecho, pies al ancho de hombros.',
      'Baja con el pecho arriba y quédate 2" abajo sin rebotar.',
      'Sube empujando el suelo con todo el pie.',
    ],
    video: 'sentadilla goblet con pausa',
  },
  'plancha-inclinada': {
    steps: [
      'Apoya los antebrazos o las manos en un banco y lleva los pies atrás hasta que el cuerpo quede en línea.',
      'Aprieta abdomen y glúteos: la cadera no cae ni sube.',
      'Mirada al banco, cuello alineado. Respira normal.',
    ],
    video: 'plancha inclinada manos en banco principiantes',
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
