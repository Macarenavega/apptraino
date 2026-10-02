import { useState } from 'react'
import type { ExerciseLog, WorkoutLog } from '../lib/store'

const dateFmt = new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })

export function HistoryView({ history, onDelete }: { history: WorkoutLog[]; onDelete: (id: string) => void }) {
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
                {mins !== null && ` · ${mins}'`} · Fase {w.phase}
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
