import { useState } from 'react'
import { weekKey } from '../data/routine'
import { estimateCalories } from '../lib/calories'
import type { ExerciseLog, WorkoutLog } from '../lib/store'

const dateFmt = new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

type Props = { history: WorkoutLog[]; bodyWeight?: number; onDelete: (id: string) => void }

export function HistoryView({ history, bodyWeight, onDelete }: Props) {
  const [open, setOpen] = useState<string | null>(null)
  const sorted = [...history].sort((a, b) => b.startedAt.localeCompare(a.startedAt))

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-2xl font-bold">Historial</h1>
        <p className="text-sm text-muted">
          {history.length} {history.length === 1 ? 'entrenamiento' : 'entrenamientos'}
        </p>
      </header>

      {history.length > 0 && <CaloriesDashboard history={history} bodyWeight={bodyWeight} />}

      {sorted.length === 0 && (
        <p className="card text-center text-muted">Todavía no hay entrenamientos registrados.</p>
      )}

      {sorted.map((w) => {
        const total = w.exercises.reduce((n, e) => n + e.sets.length, 0)
        const done = w.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
        const mins = w.finishedAt
          ? Math.round((new Date(w.finishedAt).getTime() - new Date(w.startedAt).getTime()) / 60000)
          : null
        const isOpen = open === w.id
        return (
          <section key={w.id} className="card">
            <button className="w-full text-left" onClick={() => setOpen(isOpen ? null : w.id)}>
              <div className="flex items-baseline justify-between gap-2">
                <h2 className="font-semibold">{w.sessionName}</h2>
                <span className="text-xs text-muted">{isOpen ? '▲' : '▼'}</span>
              </div>
              <p className="text-sm text-muted">
                {dateFmt.format(new Date(w.startedAt))} · {done}/{total} series
                {mins !== null && ` · ${mins}'`}
                {(w.bodyWeight ?? bodyWeight) && ` · ≈${Math.round(estimateCalories(w, (w.bodyWeight ?? bodyWeight)!).kcal)} kcal`} · Fase {w.phase}
              </p>
            </button>
            {isOpen && (
              <div className="mt-3 space-y-3">
                {w.exercises.map((e) => (
                  <ExerciseSummary key={e.exerciseId} e={e} />
                ))}
                <button
                  className="btn-ghost text-sm text-red-600 dark:text-red-400"
                  onClick={() => confirm('¿Borrar este entrenamiento del historial?') && onDelete(w.id)}
                >
                  Borrar
                </button>
              </div>
            )}
          </section>
        )
      })}
    </div>
  )
}

function ExerciseSummary({ e }: { e: ExerciseLog }) {
  const unit = { reps: '', seconds: '"', minutes: "'", check: '' }[e.target.kind]
  const values = e.sets.map((s) => (s.done ? (e.target.kind === 'check' ? '✓' : `${s.value}${unit}`) : '—'))
  return (
    <div className="text-sm">
      <p className="font-medium">{e.name}</p>
      <p className="text-muted tabular-nums">
        {values.join(' · ')}
        {e.level && ` · Nivel: ${e.level}`}
      </p>
      {e.notes && <p className="text-muted italic">{e.notes}</p>}
    </div>
  )
}

const shortDate = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })
const WEEKS = 8

/** Calorías, sesiones y minutos de las últimas semanas (la última es la actual) */
function weeklyCalories(history: WorkoutLog[], bodyWeight: number | undefined, today: Date) {
  const weeks = Array.from({ length: WEEKS }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (WEEKS - 1 - i) * 7)
    return { key: weekKey(d), kcal: 0, sessions: 0, minutes: 0 }
  })
  let missingWeight = false
  for (const w of history) {
    const week = weeks.find((x) => x.key === weekKey(new Date(w.startedAt)))
    if (!week) continue
    const kg = w.bodyWeight ?? bodyWeight
    if (!kg) {
      missingWeight = true
      continue
    }
    const est = estimateCalories(w, kg)
    week.kcal += est.kcal
    week.minutes += est.minutes
    if (w.sessionId !== 'core') week.sessions += 1
  }
  return { weeks, missingWeight }
}

/** Panel de calorías: totales de esta semana y calorías por semana (últimas 8) */
function CaloriesDashboard({ history, bodyWeight }: { history: WorkoutLog[]; bodyWeight?: number }) {
  // Al pasar el mouse se muestra una semana; al tocar (celular) queda fijada
  const [hovered, setHovered] = useState<number | null>(null)
  const [pinned, setPinned] = useState<number | null>(null)
  const [today] = useState(() => new Date())
  const { weeks, missingWeight } = weeklyCalories(history, bodyWeight, today)
  const current = weeks[WEEKS - 1]
  const max = Math.max(1, ...weeks.map((w) => w.kcal))
  const shown = hovered ?? pinned ?? WEEKS - 1
  const label = (key: string) => shortDate.format(new Date(`${key}T00:00:00`))

  if (missingWeight && !bodyWeight) {
    return (
      <section className="card text-sm text-muted">
        Agrega tu peso en <b>Ajustes</b> para ver las calorías quemadas por sesión y por semana.
      </section>
    )
  }

  return (
    <section className="card">
      <h2 className="font-semibold">Calorías (estimación)</h2>
      <div className="mt-3 grid grid-cols-3 gap-3 text-center">
        <Kpi label="Esta semana" value={Math.round(current.kcal).toLocaleString('es')} unit="kcal" />
        <Kpi label="Sesiones" value={String(current.sessions)} />
        <Kpi label="Minutos" value={String(Math.round(current.minutes))} />
      </div>

      <p className="mt-4 text-sm" aria-live="polite">
        <span className="font-semibold">{Math.round(weeks[shown].kcal).toLocaleString('es')} kcal</span>{' '}
        <span className="text-muted">
          · semana del {label(weeks[shown].key)} · {weeks[shown].sessions}{' '}
          {weeks[shown].sessions === 1 ? 'sesión' : 'sesiones'}
        </span>
      </p>
      <div className="mt-2 flex h-32 items-end gap-0.5 border-b border-line" role="list" aria-label="Calorías por semana">
        {weeks.map((w, i) => (
          <button
            key={w.key}
            role="listitem"
            className="group flex h-full flex-1 items-end justify-center outline-none"
            aria-label={`Semana del ${label(w.key)}: ${Math.round(w.kcal)} kcal`}
            onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(i)}
            onPointerLeave={() => setHovered(null)}
            onFocus={() => setPinned(i)}
            onClick={() => setPinned(i)}
          >
            <span
              className={`w-full max-w-6 rounded-t bg-emerald-600 transition-opacity ${
                shown === i ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
              }`}
              style={{ height: w.kcal > 0 ? `${Math.max(3, (w.kcal / max) * 100)}%` : '0%' }}
            />
          </button>
        ))}
      </div>
      <div className="mt-1 flex gap-0.5 text-center text-[10px] text-muted">
        {weeks.map((w, i) => (
          <span key={w.key} className="flex-1">
            {i % 2 === 1 || i === WEEKS - 1 ? label(w.key) : ''}
          </span>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">Toca una barra para ver su semana. Incluye el core diario.</p>
    </section>
  )
}

function Kpi({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="rounded-xl bg-page p-2">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-xl font-semibold">
        {value}
        {unit && <span className="ml-0.5 text-xs font-normal text-muted">{unit}</span>}
      </p>
    </div>
  )
}
