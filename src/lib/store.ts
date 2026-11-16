import { useCallback, useEffect, useState } from 'react'
import {
  CORE_EXERCISES,
  DEFAULT_PROGRAM,
  M2_ORDER,
  SESSIONS,
  coreExerciseFor,
  weekPlanFor,
  resolveExercises,
  type Approvals,
  type Exercise,
  type ProgramId,
  type Swaps,
  type SessionId,
  type Target,
} from '../data/routine'
import { HIPO_EXERCISE, V4_ORDER } from '../data/v4'

export type SetLog = { value: number | null; done: boolean }

export type ExerciseLog = {
  exerciseId: string
  name: string
  target: Target
  rest: number
  level: string
  notes: string
  sets: SetLog[]
}

export type WorkoutLog = {
  id: string
  sessionId: SessionId
  sessionName: string
  phase: 1 | 2
  startedAt: string
  finishedAt?: string
  /** Peso (kg) al terminar, para estimar calorías */
  bodyWeight?: number
  warmup: boolean[]
  exercises: ExerciseLog[]
}

export type AppState = {
  version: 1
  phase: 1 | 2
  /** Fecha (ISO) del primer entrenamiento terminado */
  startDate?: string
  approvals: Approvals
  /** Último nivel anotado por ejercicio */
  lastLevels: Record<string, string>
  /** Ejercicios reemplazados por falta de material (grupo → alternativa) */
  swaps: Swaps
  /** Días de entrenamiento elegidos por semana (clave: lunes AAAA-MM-DD; 0 = domingo … 6 = sábado) */
  weekPlans: Record<string, number[]>
  /** Peso corporal en kg, para estimar calorías */
  bodyWeight?: number
  /** Programa elegido (Mes 1, Mes 2). Sin valor se usa el programa actual */
  program?: ProgramId
  history: WorkoutLog[]
  active?: WorkoutLog
  /** Ejercicio de core elegido para un día (si no, toca el de la rotación) */
  coreChoice?: { date: string; id: string }
  /** Ya se cambió una vez a la semana tipo v4 al publicarla */
  v4Started?: boolean
}

const KEY = 'apptraino:v1'

const initialState: AppState = {
  version: 1,
  v4Started: true,
  phase: 1,
  approvals: { superman: false, pike: false, rdl: false, abdomen: false },
  lastLevels: {},
  swaps: {},
  weekPlans: {},
  history: [],
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as AppState
    // Al publicar la semana tipo v4 pasa a ser la rutina en uso (una sola vez; después se respeta Ajustes)
    const v4 = parsed.v4Started ? {} : { program: 'v4' as ProgramId, v4Started: true }
    return { ...initialState, ...parsed, ...v4, approvals: { ...initialState.approvals, ...parsed.approvals } }
  } catch {
    return initialState
  }
}

function save(state: AppState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Sin almacenamiento disponible: la app sigue funcionando en memoria
  }
}

export function useAppState() {
  const [state, setState] = useState<AppState>(load)
  useEffect(() => save(state), [state])
  const update = useCallback((fn: (s: AppState) => AppState) => setState(fn), [])
  return [state, update] as const
}

/** Ejercicio de core del día: el elegido para hoy o, si no, el de la rotación */
export function coreFor(state: AppState, now = new Date()) {
  // En la semana tipo v4 la rutina diaria son los hipopresivos
  if (programOf(state) === 'v4') return HIPO_EXERCISE
  const c = state.coreChoice
  const chosen = c && c.date === now.toDateString() ? CORE_EXERCISES.find((e) => e.id === c.id) : undefined
  return chosen ?? coreExerciseFor(now)
}

/** Si ya se hizo el core hoy */
export function coreDoneToday(state: AppState, now = new Date()) {
  return state.history.some((w) => w.sessionId === 'core' && new Date(w.startedAt).toDateString() === now.toDateString())
}

export function programOf(state: AppState): ProgramId {
  return state.program ?? DEFAULT_PROGRAM
}

/** Plan semanal en uso (orden de sesiones y días por defecto) */
export function weekPlanOf(state: AppState) {
  return weekPlanFor(programOf(state), state.phase)
}

/**
 * Semana del Mes 2 (1-4) contando desde la primera sesión del Mes 2 terminada.
 * Antes de empezar es la semana 1; después de la 4 devuelve 5 (mes completo).
 */
export function m2Week(state: AppState, now = new Date()) {
  const first = state.history.find((w) => M2_ORDER.includes(w.sessionId) && w.finishedAt)
  if (!first) return 1
  const days = Math.floor((now.getTime() - new Date(first.startedAt).getTime()) / 86_400_000)
  return Math.min(5, Math.floor(days / 7) + 1)
}

/**
 * Semana del ciclo de piernas de la v4 (1-5), contando desde la primera sesión v4 terminada.
 * Al terminar la semana 5 vuelve a empezar.
 */
export function v4Week(state: AppState, now = new Date()) {
  const first = state.history.find((w) => V4_ORDER.includes(w.sessionId) && w.finishedAt)
  if (!first) return 1
  const days = Math.floor((now.getTime() - new Date(first.startedAt).getTime()) / 86_400_000)
  return (Math.floor(days / 7) % 5) + 1
}

export function newWorkout(state: AppState, sessionId: SessionId, warmupItems: number, coreId?: string): WorkoutLog {
  const session = SESSIONS[sessionId]
  // Mes 2, semana 4: descarga, 2 series por ejercicio con las mismas cargas
  const deloadM2 = M2_ORDER.includes(sessionId) && m2Week(state) === 4
  // v4, semana 5 del ciclo: la mitad de las series en el Día 1 (los estiramientos no se tocan)
  const deloadV4 = sessionId === 'v4d1' && v4Week(state) === 5
  // El core diario es un solo ejercicio que rota cada día (en la v4, los hipopresivos)
  const active = (
    sessionId === 'core'
      ? [[...CORE_EXERCISES, HIPO_EXERCISE].find((e) => e.id === coreId) ?? coreExerciseFor(new Date())]
      : resolveExercises(session, state.approvals, state.swaps).active
  ).map((ex) =>
    deloadM2
      ? { ...ex, sets: Math.min(ex.sets, 2) }
      : deloadV4 && ex.block === 'Fuerza'
        ? { ...ex, sets: Math.ceil(ex.sets / 2) }
        : ex,
  )
  const program = M2_ORDER.includes(sessionId) ? M2_ORDER : V4_ORDER.includes(sessionId) ? V4_ORDER : undefined
  return {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    sessionId,
    sessionName: sessionId === 'core' && coreId === HIPO_EXERCISE.id ? 'Hipopresivos' : session.name,
    phase: state.phase,
    startedAt: new Date().toISOString(),
    warmup: Array(warmupItems).fill(false),
    exercises: active.map((ex) => {
      const log = exerciseLog(ex, state.lastLevels)
      // Al empezar un programa, los ejercicios con nivel de partida arrancan desde ese nivel
      const doneInProgram = state.history.some(
        (w) => program?.includes(w.sessionId) && w.exercises.some((e) => e.exerciseId === ex.id),
      )
      return ex.startLevel && program && !doneInProgram ? { ...log, level: ex.startLevel } : log
    }),
  }
}

export function exerciseLog(ex: Exercise, lastLevels: Record<string, string>): ExerciseLog {
  return {
    exerciseId: ex.id,
    name: ex.name,
    target: ex.target,
    rest: ex.rest,
    level: lastLevels[ex.id] ?? '',
    notes: '',
    sets: Array.from({ length: ex.sets }, () => ({ value: null, done: false })),
  }
}

export function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}
