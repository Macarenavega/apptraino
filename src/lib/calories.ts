import { SESSIONS } from '../data/routine'
import type { WorkoutLog } from './store'

/**
 * Estimación de calorías con METs (Compendio de Actividades Físicas):
 * kcal = MET × peso (kg) × horas. Es una aproximación: la cifra real depende
 * de la intensidad, la técnica y de cada persona.
 */
const MET = {
  /** Entrenamiento de fuerza / calistenia, esfuerzo moderado (incluye descansos) */
  strength: 3.5,
  /** Calistenia suave (core) */
  core: 2.8,
  /** Movilidad y estiramientos */
  mobility: 2.3,
  elliptical: 5.0,
  walk: 3.5,
  bike: 4.8,
  /** Circuito / clase funcional, esfuerzo moderado */
  functional: 4.3,
}

/** Ejercicios de cardio dentro de las sesiones (los minutos se registran en cada serie) */
const CARDIO: Record<string, { label: string; met: number }> = {
  'caminata-a': { label: 'Caminata', met: MET.walk },
  'caminata-b': { label: 'Caminata', met: MET.walk },
  'full-caminata': { label: 'Caminata', met: MET.walk },
  'mov-caminata': { label: 'Caminata', met: MET.walk },
  'alt-cinta': { label: 'Cinta', met: MET.walk },
  'alt-bici': { label: 'Bicicleta estática', met: MET.bike },
  'alt-eliptica': { label: 'Elíptica', met: MET.elliptical },
}

/** El primer ítem del calentamiento es la elíptica de 10' */
const WARMUP_CARDIO = { label: 'Elíptica (calentamiento)', minutes: 10, met: MET.elliptical }

/** Tope de duración para no inflar la cifra si la sesión quedó abierta */
const MAX_MINUTES = 120

export type CaloriePart = { label: string; minutes: number; kcal: number }

export type CalorieEstimate = {
  kcal: number
  minutes: number
  parts: CaloriePart[]
  /** true si la duración se estimó porque la sesión se registró muy rápido */
  estimatedDuration: boolean
}

const kcalOf = (met: number, kg: number, minutes: number) => (met * kg * minutes) / 60

function sessionMinutes(w: WorkoutLog) {
  const est = SESSIONS[w.sessionId]?.estimate
  return Number(est?.match(/\d+/)?.[0] ?? 40)
}

export function estimateCalories(w: WorkoutLog, kg: number): CalorieEstimate {
  const end = w.finishedAt ? new Date(w.finishedAt).getTime() : Date.now()
  let minutes = Math.min(MAX_MINUTES, Math.max(0, (end - new Date(w.startedAt).getTime()) / 60000))

  // Si se registró todo de golpe (menos de 10' en una sesión principal), usar la duración
  // estimada de la sesión según la proporción de series hechas
  const total = w.exercises.reduce((n, e) => n + e.sets.length, 0)
  const done = w.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
  const estimatedDuration = w.sessionId !== 'core' && minutes < 10 && done > 0
  if (estimatedDuration) minutes = sessionMinutes(w) * (done / Math.max(1, total))

  const parts: CaloriePart[] = []
  let cardioMinutes = 0

  // Solo la rutina propia empieza con la elíptica (las sesiones con calentamiento propio no)
  if (w.warmup[0] && !SESSIONS[w.sessionId]?.warmup) {
    parts.push({ label: WARMUP_CARDIO.label, minutes: WARMUP_CARDIO.minutes, kcal: kcalOf(WARMUP_CARDIO.met, kg, 10) })
    cardioMinutes += WARMUP_CARDIO.minutes
  }

  for (const e of w.exercises) {
    const cardio = CARDIO[e.exerciseId]
    if (!cardio) continue
    const mins = e.sets.filter((s) => s.done).reduce((n, s) => n + (s.value ?? 0), 0)
    if (mins <= 0) continue
    parts.push({ label: cardio.label, minutes: mins, kcal: kcalOf(cardio.met, kg, mins) })
    cardioMinutes += mins
  }

  minutes = Math.max(minutes, cardioMinutes)
  const restMinutes = minutes - cardioMinutes
  if (restMinutes > 0) {
    const base =
      w.sessionId === 'core'
        ? { label: 'Core', met: MET.core }
        : w.sessionId === 'mov'
          ? { label: 'Movilidad', met: MET.mobility }
          : w.sessionId === 'gime'
            ? { label: 'Clase funcional', met: MET.functional }
          : { label: 'Fuerza (con descansos)', met: MET.strength }
    parts.unshift({ label: base.label, minutes: restMinutes, kcal: kcalOf(base.met, kg, restMinutes) })
  }

  return {
    kcal: parts.reduce((n, p) => n + p.kcal, 0),
    minutes,
    parts,
    estimatedDuration,
  }
}
