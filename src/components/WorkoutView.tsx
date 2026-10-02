import { useState } from 'react'
import { SESSIONS, WARMUP, formatTarget, resolveExercises, type Approvals } from '../data/routine'
import type { ExerciseLog, WorkoutLog } from '../lib/store'
import { ExerciseGuide } from './ExerciseGuide'
import type { Timer } from '../lib/timer'

type Props = {
  workout: WorkoutLog
  approvals: Approvals
  timer: Timer
  onChange: (fn: (w: WorkoutLog) => WorkoutLog) => void
  onFinish: () => void
  onDiscard: () => void
}

export function WorkoutView({ workout, approvals, timer, onChange, onFinish, onDiscard }: Props) {
  const session = SESSIONS[workout.sessionId]
  const { blocked } = resolveExercises(session, approvals)
  const notes = new Map(
    session.exercises.flatMap((ex) => [ex, ...(ex.replacement ? [ex.replacement] : [])]).map((ex) => [ex.id, ex]),
  )
  const totalSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0)
  const doneSets = workout.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
  const warmupDone = workout.warmup.every(Boolean)
  const [showWarmup, setShowWarmup] = useState(!warmupDone)

  const updateExercise = (i: number, fn: (e: ExerciseLog) => ExerciseLog) =>
    onChange((w) => ({ ...w, exercises: w.exercises.map((e, j) => (j === i ? fn(e) : e)) }))

  const setValue = (ei: number, si: number, value: number | null, done: boolean) =>
    updateExercise(ei, (e) => ({ ...e, sets: e.sets.map((s, j) => (j === si ? { value, done } : s)) }))

  const isLastSet = (ei: number, si: number) =>
    ei === workout.exercises.length - 1 && si === workout.exercises[ei].sets.length - 1

  const startRest = (ei: number, si: number) => {
    const ex = workout.exercises[ei]
    if (ex.rest > 0 && !isLastSet(ei, si)) {
      const next = si < ex.sets.length - 1 ? `${ex.name} — serie ${si + 2}` : `Siguiente: ${workout.exercises[ei + 1].name}`
      timer.start('rest', next, ex.rest)
    }
  }

  const completeSet = (ei: number, si: number, value: number) => {
    setValue(ei, si, value, true)
    startRest(ei, si)
  }

  const toggleSet = (ei: number, si: number) => {
    const ex = workout.exercises[ei]
    const set = ex.sets[si]
    if (set.done) {
      setValue(ei, si, set.value, false)
      return
    }
    const t = ex.target
    const fallback = t.kind === 'check' ? 1 : t.max
    completeSet(ei, si, set.value ?? fallback)
  }

  const startWork = (ei: number, si: number) => {
    const ex = workout.exercises[ei]
    const t = ex.target
    if (t.kind === 'seconds') {
      const secs = ex.sets[si].value ?? t.max
      timer.start('work', `${ex.name} — serie ${si + 1}`, secs, (elapsed) => completeSet(ei, si, elapsed))
    } else if (t.kind === 'minutes') {
      const mins = ex.sets[si].value ?? t.min
      timer.start('work', ex.name, Math.round(mins * 60), (elapsed) =>
        completeSet(ei, si, Math.round((elapsed / 60) * 10) / 10),
      )
    }
  }

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{workout.sessionName}</h1>
          <p className="text-sm text-muted">
            {doneSets}/{totalSets} series · Fase {workout.phase}
          </p>
        </div>
        <button className="btn-ghost text-sm" onClick={() => confirm('¿Descartar este entrenamiento?') && onDiscard()}>
          Descartar
        </button>
      </header>

      <div className="h-2 overflow-hidden rounded-full bg-track">
        <div className="h-full bg-emerald-500 transition-[width]" style={{ width: `${(doneSets / totalSets) * 100}%` }} />
      </div>

      <section className="card">
        <button className="flex w-full items-center justify-between" onClick={() => setShowWarmup((v) => !v)}>
          <span className="font-semibold">
            Calentamiento (8-10') {warmupDone && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
          </span>
          <span className="text-muted">{showWarmup ? '▲' : '▼'}</span>
        </button>
        {showWarmup && (
          <ul className="mt-3 space-y-2">
            {WARMUP.map((item, i) => (
              <li key={item}>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="size-5 accent-emerald-600"
                    checked={workout.warmup[i] ?? false}
                    onChange={(e) =>
                      onChange((w) => ({ ...w, warmup: w.warmup.map((v, j) => (j === i ? e.target.checked : v)) }))
                    }
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      {workout.exercises.map((ex, ei) => {
        const meta = notes.get(ex.exerciseId)
        const allDone = ex.sets.every((s) => s.done)
        return (
          <section key={ex.exerciseId} className={`card ${allDone ? 'opacity-70' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold leading-snug">{ex.name}</h2>
              {allDone && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
            </div>
            <p className="mt-1 text-sm text-muted">
              {formatTarget(ex.target, ex.sets.length)}
              {ex.rest > 0 && ` · descanso ${ex.rest}"`}
            </p>
            {meta?.note && <p className="mt-1 text-sm text-muted italic">{meta.note}</p>}
            <ExerciseGuide exerciseId={ex.exerciseId} />

            {meta?.levelHint && (
              <label className="mt-3 block">
                <span className="text-xs font-medium text-muted">Nivel</span>
                <input
                  className="input mt-1"
                  placeholder={meta.levelHint}
                  value={ex.level}
                  onChange={(e) => updateExercise(ei, (x) => ({ ...x, level: e.target.value }))}
                />
              </label>
            )}

            <div className="mt-3 space-y-2">
              {ex.sets.map((set, si) => (
                <SetRow
                  key={si}
                  ex={ex}
                  index={si}
                  onValue={(v) => setValue(ei, si, v, set.done)}
                  onToggle={() => toggleSet(ei, si)}
                  onStart={() => startWork(ei, si)}
                  timerBusy={!!timer.timer && timer.timer.kind === 'work'}
                />
              ))}
            </div>

            <input
              className="input mt-3 text-sm"
              placeholder="Notas (opcional)"
              value={ex.notes}
              onChange={(e) => updateExercise(ei, (x) => ({ ...x, notes: e.target.value }))}
            />
          </section>
        )
      })}

      {blocked.length > 0 && (
        <section className="card border-amber-300 bg-amber-50 text-sm dark:border-amber-700 dark:bg-amber-950/40">
          <p className="font-semibold">⚠️ No incluidos (pendientes de aprobación)</p>
          <ul className="mt-1 list-disc pl-5">
            {blocked.map((ex) => (
              <li key={ex.id}>{ex.name}</li>
            ))}
          </ul>
        </section>
      )}

      <button
        className="btn-primary w-full py-4 text-lg"
        onClick={() => {
          if (doneSets < totalSets && !confirm(`Te faltan ${totalSets - doneSets} series. ¿Terminar igual?`)) return
          timer.stop()
          onFinish()
        }}
      >
        Terminar entrenamiento
      </button>
    </div>
  )
}

type SetRowProps = {
  ex: ExerciseLog
  index: number
  onValue: (v: number | null) => void
  onToggle: () => void
  onStart: () => void
  timerBusy: boolean
}

function SetRow({ ex, index, onValue, onToggle, onStart, timerBusy }: SetRowProps) {
  const set = ex.sets[index]
  const t = ex.target

  if (t.kind === 'check') {
    return (
      <button className={`set-btn w-full ${set.done ? 'set-done' : ''}`} onClick={onToggle}>
        {set.done ? '✓ Hecha' : 'Marcar como hecha'}
      </button>
    )
  }

  const unit = t.kind === 'reps' ? (t.perSide ? 'reps/lado' : 'reps') : t.kind === 'seconds' ? 'seg' : 'min'
  const placeholder = t.kind === 'minutes' ? String(t.min) : String(t.max)
  const timed = t.kind === 'seconds' || t.kind === 'minutes'

  return (
    <div className="flex items-center gap-2">
      <span className="w-14 shrink-0 text-sm text-muted">{ex.sets.length > 1 ? `Serie ${index + 1}` : ''}</span>
      <input
        type="number"
        inputMode="decimal"
        min={0}
        className="input w-20 text-center tabular-nums"
        placeholder={placeholder}
        value={set.value ?? ''}
        onChange={(e) => onValue(e.target.value === '' ? null : Number(e.target.value))}
      />
      <span className="w-16 shrink-0 text-xs text-muted">{unit}</span>
      {timed && !set.done && (
        <button className="set-btn" onClick={onStart} disabled={timerBusy} aria-label="Iniciar temporizador">
          ▶
        </button>
      )}
      <button
        className={`set-btn flex-1 ${set.done ? 'set-done' : ''}`}
        onClick={onToggle}
        aria-label={set.done ? 'Desmarcar serie' : 'Marcar serie como hecha'}
      >
        {set.done ? '✓' : 'Hecho'}
      </button>
    </div>
  )
}
