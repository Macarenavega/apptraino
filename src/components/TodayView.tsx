import { useState } from 'react'
import {
  CAUTIONS,
  DAY_NAMES,
  PHASE1_DAYS,
  PHASE2_CRITERIA,
  SCHEDULE,
  SESSIONS,
  formatTarget,
  resolveExercises,
  type CautionId,
  type SessionId,
} from '../data/routine'
import { daysSince, type AppState } from '../lib/store'

type Props = {
  state: AppState
  onStart: (id: SessionId) => void
  onResume: () => void
  onPhase2: () => void
  onOpenSettings: () => void
}

export function TodayView({ state, onStart, onResume, onPhase2, onOpenSettings }: Props) {
  const [now] = useState(() => new Date())
  const today = now.getDay()
  const plan = SCHEDULE[state.phase][today]
  const [picked, setPicked] = useState<SessionId | undefined>(plan.session)
  const sessionId = picked ?? plan.session
  const pending = (Object.keys(CAUTIONS) as CautionId[]).filter((c) => !state.approvals[c])
  const doneToday = state.history.some(
    (w) => w.sessionId === sessionId && new Date(w.startedAt).toDateString() === now.toDateString(),
  )
  const sessionsInPhase = [...new Set(SCHEDULE[state.phase].flatMap((d) => (d.session ? [d.session] : [])))]

  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-muted">
          {DAY_NAMES[today]} · Fase {state.phase}
        </p>
        <h1 className="text-2xl font-bold">Hoy</h1>
      </header>

      {pending.length > 0 && (
        <button
          onClick={onOpenSettings}
          className="card block w-full border-amber-300 bg-amber-50 text-left text-sm dark:border-amber-700 dark:bg-amber-950/40"
        >
          <p className="font-semibold">⚠️ Pendiente de confirmar con profesional</p>
          <p className="mt-1">
            {pending.length === 1 ? 'Hay 1 ejercicio desactivado' : `Hay ${pending.length} ejercicios desactivados`} por
            la molestia en el sacro y la protrusión cervical. Cuando un traumatólogo o fisioterapeuta los apruebe,
            actívalos en Ajustes.
          </p>
        </button>
      )}

      {state.active ? (
        <section className="card">
          <p className="text-sm text-muted">Entrenamiento en curso</p>
          <h2 className="text-xl font-semibold">{state.active.sessionName}</h2>
          <button className="btn-primary mt-4 w-full py-3" onClick={onResume}>
            Continuar
          </button>
        </section>
      ) : sessionId ? (
        <SessionCard
          state={state}
          id={sessionId}
          isToday={sessionId === plan.session}
          doneToday={doneToday}
          onStart={() => onStart(sessionId)}
        />
      ) : (
        <section className="card text-center">
          <p className="text-4xl">🌿</p>
          <h2 className="mt-2 text-xl font-semibold">Día de descanso</h2>
          <p className="mt-1 text-muted">{plan.restLabel}</p>
        </section>
      )}

      {!state.active && (
        <section>
          <h3 className="mb-2 text-sm font-semibold text-muted">Hacer otra sesión</h3>
          <div className="flex flex-wrap gap-2">
            {sessionsInPhase.map((id) => (
              <button
                key={id}
                className={`chip ${id === sessionId ? 'chip-active' : ''}`}
                onClick={() => setPicked(id)}
              >
                {SESSIONS[id].name}
              </button>
            ))}
          </div>
        </section>
      )}

      <WeekPlan phase={state.phase} today={today} />
      <PhaseCard state={state} onPhase2={onPhase2} />
    </div>
  )
}

function SessionCard({
  state,
  id,
  isToday,
  doneToday,
  onStart,
}: {
  state: AppState
  id: SessionId
  isToday: boolean
  doneToday: boolean
  onStart: () => void
}) {
  const session = SESSIONS[id]
  const { active, blocked } = resolveExercises(session, state.approvals)
  return (
    <section className="card">
      <p className="text-sm text-muted">{isToday ? 'Toca hoy' : 'Sesión elegida'}</p>
      <h2 className="text-xl font-semibold">
        {session.name} {doneToday && <span className="text-emerald-600 dark:text-emerald-400">✓</span>}
      </h2>
      {session.estimate && <p className="text-sm text-muted">Tiempo estimado: {session.estimate}</p>}
      <ul className="mt-3 divide-y divide-line">
        {active.map((ex) => (
          <li key={ex.id} className="flex justify-between gap-3 py-2 text-sm">
            <span>{ex.name}</span>
            <span className="shrink-0 text-muted tabular-nums">{formatTarget(ex.target, ex.sets)}</span>
          </li>
        ))}
        {blocked.map((ex) => (
          <li key={ex.id} className="flex justify-between gap-3 py-2 text-sm text-muted line-through">
            <span>⚠️ {ex.name}</span>
          </li>
        ))}
      </ul>
      <button className="btn-primary mt-4 w-full py-3 text-lg" onClick={onStart}>
        {doneToday ? 'Repetir' : 'Empezar'}
      </button>
    </section>
  )
}

function WeekPlan({ phase, today }: { phase: 1 | 2; today: number }) {
  const order = [1, 2, 3, 4, 5, 6, 0]
  return (
    <section className="card">
      <h3 className="font-semibold">Semana (Fase {phase})</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {order.map((d) => {
          const p = SCHEDULE[phase][d]
          return (
            <li key={d} className={`flex justify-between gap-3 ${d === today ? 'font-semibold' : ''}`}>
              <span className="w-24 shrink-0">{DAY_NAMES[d]}</span>
              <span className={`text-right ${p.session ? '' : 'text-muted'}`}>
                {p.session ? SESSIONS[p.session].name : p.restLabel}
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function PhaseCard({ state, onPhase2 }: { state: AppState; onPhase2: () => void }) {
  const [checks, setChecks] = useState(PHASE2_CRITERIA.map(() => false))
  if (state.phase === 2) return null

  const days = state.startDate ? daysSince(state.startDate) : 0
  const ready = days >= PHASE1_DAYS
  const week = Math.min(4, Math.floor(days / 7) + 1)

  return (
    <section className="card">
      <h3 className="font-semibold">Fase 1 → Fase 2</h3>
      {!state.startDate ? (
        <p className="mt-1 text-sm text-muted">La Fase 1 dura 4 semanas y empieza a contar con tu primer entrenamiento.</p>
      ) : !ready ? (
        <>
          <p className="mt-1 text-sm text-muted">
            Semana {week} de 4 · faltan {PHASE1_DAYS - days} días para poder pasar a Fase 2.
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-track">
            <div className="h-full bg-emerald-500" style={{ width: `${(days / PHASE1_DAYS) * 100}%` }} />
          </div>
        </>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">Completaste 4 semanas. Pasa a Fase 2 solo si se cumple todo esto:</p>
          <ul className="mt-2 space-y-2 text-sm">
            {PHASE2_CRITERIA.map((c, i) => (
              <li key={c}>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="size-5 accent-emerald-600"
                    checked={checks[i]}
                    onChange={(e) => setChecks((cs) => cs.map((v, j) => (j === i ? e.target.checked : v)))}
                  />
                  {c}
                </label>
              </li>
            ))}
          </ul>
          <button className="btn-primary mt-3 w-full" disabled={!checks.every(Boolean)} onClick={onPhase2}>
            Pasar a Fase 2
          </button>
          <p className="mt-2 text-xs text-muted">No agregues días y subas dificultad a la vez: una cosa por vez.</p>
        </>
      )}
    </section>
  )
}
