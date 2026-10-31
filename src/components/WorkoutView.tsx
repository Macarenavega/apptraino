import { Fragment, useState } from 'react'
import { CORE_GROUP, SESSIONS, findSlot, warmupFor, formatTarget, resolveExercises, type Approvals, type Exercise } from '../data/routine'
import type { ExerciseLog, WorkoutLog } from '../lib/store'
import { ExerciseGuide } from './ExerciseGuide'
import type { Timer } from '../lib/timer'

type Props = {
  workout: WorkoutLog
  approvals: Approvals
  timer: Timer
  onChange: (fn: (w: WorkoutLog) => WorkoutLog) => void
  onFinish: () => void
  /** Volver a la pantalla Hoy sin cerrar el entrenamiento */
  onBack: () => void
  onDiscard: () => void
  /** Cambia el ejercicio de la posición indicada por otra opción de su grupo */
  onSwap: (index: number, exercise: Exercise, group: string) => void
}

export function WorkoutView({ workout, approvals, timer, onChange, onFinish, onDiscard, onSwap, onBack }: Props) {
  const session = SESSIONS[workout.sessionId]
  const { blocked } = resolveExercises(session, approvals)
  const totalSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0)
  const doneSets = workout.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
  const warmupDone = workout.warmup.every(Boolean)
  const [showWarmup, setShowWarmup] = useState(!warmupDone)
  const [swapping, setSwapping] = useState<number | null>(null)

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
      <button className="text-sm font-medium text-muted" onClick={onBack}>
        ← Hoy
      </button>
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-[32px] leading-tight font-light">{workout.sessionName}</h1>
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

      {session.intro && (
        <section className="card bg-stage text-white dark:border-line">
          <ul className="space-y-1 text-sm">
            {session.intro.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
      )}

      {workout.warmup.length > 0 && (
      <section className="card">
        <button className="flex w-full items-center justify-between" onClick={() => setShowWarmup((v) => !v)}>
          <span className="font-semibold">
            Calentamiento ({session.warmup ? `~${session.warmup.length > 2 ? 10 : 5}'` : "~15'"}) {warmupDone && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
          </span>
          <span className="text-muted">{showWarmup ? '▲' : '▼'}</span>
        </button>
        {showWarmup && (
          <ul className="mt-3 space-y-2">
            {warmupFor(workout.sessionId).map((item, i) => (
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
      )}

      {workout.exercises.map((ex, ei) => {
        const found = findSlot(session, approvals, ex.exerciseId)
        const meta = found?.exercise
        const swap = found?.swap
        const allDone = ex.sets.every((s) => s.done)
        const prevBlock = ei > 0 ? findSlot(session, approvals, workout.exercises[ei - 1].exerciseId)?.exercise.block : undefined
        return (
          <Fragment key={ex.exerciseId}>
          {meta?.block && meta.block !== prevBlock && <h3 className="eyebrow px-1 pt-2 text-muted">{meta.block}</h3>}
          <section className={`card ${allDone ? 'opacity-70' : ''}`}>
            <div className="flex items-start justify-between gap-2">
              <h2 className="font-semibold leading-snug">{ex.name}</h2>
              {allDone ? (
                <span className="text-emerald-600 dark:text-emerald-400">✓</span>
              ) : (
                swap && (
                  <button
                    className="shrink-0 rounded-lg border border-line px-2 py-1 text-xs font-medium"
                    onClick={() => setSwapping(swapping === ei ? null : ei)}
                    aria-expanded={swapping === ei}
                  >
                    ⇄ Cambiar
                  </button>
                )
              )}
            </div>
            {meta?.swappedFrom && <p className="text-xs text-muted">En lugar de: {meta.swappedFrom}</p>}
            {swap && swapping === ei && (
              <div className="mt-3 rounded-xl border border-line bg-page p-3">
                <p className="text-sm font-medium">
                  {swap.group === CORE_GROUP ? 'Elige otro ejercicio de core:' : '¿No tienes el material? Elige otra opción:'}
                </p>
                <ul className="mt-2 space-y-2">
                  {swap.options.map((opt, oi) => {
                    const current = opt.id === ex.exerciseId
                    return (
                      <li key={opt.id}>
                        <button
                          className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                            current ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'border-line bg-surface'
                          }`}
                          disabled={current}
                          onClick={() => {
                            if (ex.sets.some((s) => s.done) && !confirm('Ya marcaste series de este ejercicio. ¿Cambiarlo igual?'))
                              return
                            onSwap(ei, opt, swap.group)
                            setSwapping(null)
                          }}
                        >
                          {opt.name}
                          {oi === 0 && <span className="text-muted"> (original)</span>}
                          {current && <span className="text-emerald-700 dark:text-emerald-400"> · actual</span>}
                        </button>
                      </li>
                    )
                  })}
                </ul>
                <p className="mt-2 text-xs text-muted">
                  {swap.group === CORE_GROUP
                    ? 'El cambio vale solo para hoy.'
                    : 'La app recordará tu elección para las próximas sesiones.'}
                </p>
              </div>
            )}
            <p className="mt-1 text-sm text-muted">
              {formatTarget(ex.target, ex.sets.length)}
              {ex.rest > 0 && ` · descanso ${ex.rest}"`}
            </p>
            {meta?.note && <p className="mt-1 text-sm text-muted italic">{meta.note}</p>}
            {meta?.partner && (
              <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 rounded-xl bg-page p-3 text-sm">
                <dt className="font-semibold text-emerald-700 dark:text-emerald-400">Tú</dt>
                <dd>{meta.partner.me}</dd>
                <dt className="font-semibold">Gime</dt>
                <dd>{meta.partner.gime}</dd>
              </dl>
            )}
            <ExerciseGuide exerciseId={ex.exerciseId} defaultOpen={workout.sessionId === 'gime' || workout.sessionId === 'fullbody'} />

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
          </Fragment>
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
