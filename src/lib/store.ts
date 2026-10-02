import { useCallback, useEffect, useState } from 'react'
import {
  SESSIONS,
  resolveExercises,
  type Approvals,
  type SessionId,
  type Target,
} from '../data/routine'

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
  history: WorkoutLog[]
  active?: WorkoutLog
}

const KEY = 'apptraino:v1'

const initialState: AppState = {
  version: 1,
  phase: 1,
  approvals: { superman: false, pike: false, rdl: false },
  lastLevels: {},
  history: [],
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as AppState
    return { ...initialState, ...parsed, approvals: { ...initialState.approvals, ...parsed.approvals } }
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

export function newWorkout(state: AppState, sessionId: SessionId, warmupItems: number): WorkoutLog {
  const session = SESSIONS[sessionId]
  const { active } = resolveExercises(session, state.approvals)
  return {
    id: crypto.randomUUID?.() ?? String(Date.now()),
    sessionId,
    sessionName: session.name,
    phase: state.phase,
    startedAt: new Date().toISOString(),
    warmup: Array(warmupItems).fill(false),
    exercises: active.map((ex) => ({
      exerciseId: ex.id,
      name: ex.name,
      target: ex.target,
      rest: ex.rest,
      level: state.lastLevels[ex.id] ?? '',
      notes: '',
      sets: Array.from({ length: ex.sets }, () => ({ value: null, done: false })),
    })),
  }
}

export function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
}
