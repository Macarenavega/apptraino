import { useEffect, useRef, useState } from 'react'
import {
  CAUTIONS,
  DAY_NAMES,
  DAY_SHORT,
  M2_NOTES,
  M2_WEEKS,
  PHASE1_DAYS,
  PHASE2_CRITERIA,
  SESSIONS,
  EXERCISE_IMAGES,
  coreExerciseFor,
  formatTarget,
  missingSessions,
  planWeek,
  resolveExercises,
  weekKey,
  type CautionId,
  type SessionId,
} from '../data/routine'
import { estimateCalories } from '../lib/calories'
import { daysSince, m2Week, programOf, weekPlanOf, type AppState } from '../lib/store'

type Props = {
  state: AppState
  onStart: (id: SessionId) => void
  onResume: () => void
  onPhase2: () => void
  onOpenSettings: () => void
  /** Guarda los días elegidos de una semana (undefined = volver al plan por defecto) */
  onWeekPlan: (key: string, days: number[] | undefined) => void
}

export function TodayView({ state, onStart, onResume, onPhase2, onOpenSettings, onWeekPlan }: Props) {
  const [now] = useState(() => new Date())
  const today = now.getDay()
  const isM2 = programOf(state) === 'm2'
  const weekDef = weekPlanOf(state)
  const plan = planWeek(weekDef, state.weekPlans[weekKey(now)])[today]
  const [picked, setPicked] = useState<SessionId | undefined>(plan.session)
  // Cada toque en "Elegir días" de la cabecera abre el selector de la tarjeta Semana
  const [openPlanner, setOpenPlanner] = useState(0)
  const sessionId = picked ?? plan.session
  const pending = (Object.keys(CAUTIONS) as CautionId[]).filter((c) => !state.approvals[c])
  const doneToday = state.history.some(
    (w) => w.sessionId === sessionId && new Date(w.startedAt).toDateString() === now.toDateString(),
  )
  // En el Mes 1 la sesión de abdomen es extra; el Mes 2 la deja fuera (flexión de columna)
  const sessionsInPhase: SessionId[] = isM2 ? weekDef.order : [...weekDef.order, 'abs']
  const coreDone = state.history.some(
    (w) => w.sessionId === 'core' && new Date(w.startedAt).toDateString() === now.toDateString(),
  )

  return (
    <div className="space-y-4">
      <Hero
        state={state}
        now={now}
        sessionId={sessionId}
        isToday={sessionId === plan.session}
        doneToday={doneToday}
        restLabel={plan.restLabel}
        label={`${DAY_NAMES[today]} · ${isM2 ? `Mes 2 · Semana ${Math.min(4, m2Week(state, now))} de 4` : `Fase ${state.phase}`}`}
        onStart={() => sessionId && onStart(sessionId)}
        coreDone={coreDone}
        onCore={() => onStart('core')}
        onResume={onResume}
        onPlanDays={() => setOpenPlanner((n) => n + 1)}
      />

      {isM2 && (
        <section className="card border-amber-300 bg-amber-50 text-sm dark:border-amber-700 dark:bg-amber-950/40">
          <p className="font-semibold">⚠️ {M2_NOTES.warning}</p>
          <p className="mt-1">{M2_NOTES.out}</p>
        </section>
      )}

      {!isM2 && pending.length > 0 && (
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

      {!state.active && <CoreCard now={now} done={coreDone} onStart={() => onStart('core')} />}

      {!state.active && sessionId && <SessionCard state={state} id={sessionId} />}


      <DayCalories state={state} now={now} onOpenSettings={onOpenSettings} />

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

      <WeekPlanner state={state} now={now} onWeekPlan={onWeekPlan} openRequest={openPlanner} />
      {isM2 ? <M2WeekCard state={state} now={now} /> : <PhaseCard state={state} onPhase2={onPhase2} />}
    </div>
  )
}

function SessionCard({ state, id }: { state: AppState; id: SessionId }) {
  const session = SESSIONS[id]
  const { active, blocked } = resolveExercises(session, state.approvals, state.swaps)
  return (
    <section className="card">
      <p className="eyebrow text-muted">En esta sesión</p>
      <ul className="mt-2 divide-y divide-line">
        {active.map((ex, i) => (
          <li key={ex.id} className="flex items-baseline gap-3 py-2.5 text-sm">
            <span className="w-5 shrink-0 text-xs font-medium text-muted tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <span className="flex-1">
              {ex.name}
              {ex.swappedFrom && <span className="block text-xs text-muted">en lugar de: {ex.swappedFrom}</span>}
            </span>
            <span className="shrink-0 text-muted tabular-nums">{formatTarget(ex.target, ex.sets)}</span>
          </li>
        ))}
        {blocked.map((ex) => (
          <li key={ex.id} className="flex justify-between gap-3 py-2.5 text-sm text-muted line-through">
            <span>⚠️ {ex.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

/** Portada oscura con foto: la sesión de hoy, cómo va la semana y el botón para empezar */
function Hero({
  state,
  now,
  sessionId,
  isToday,
  doneToday,
  restLabel,
  label,
  coreDone,
  onStart,
  onCore,
  onResume,
  onPlanDays,
}: {
  state: AppState
  now: Date
  sessionId?: SessionId
  isToday: boolean
  doneToday: boolean
  restLabel?: string
  label: string
  coreDone: boolean
  onStart: () => void
  onCore: () => void
  onResume: () => void
  onPlanDays: () => void
}) {
  const session = sessionId ? SESSIONS[sessionId] : undefined
  const exercises = session ? resolveExercises(session, state.approvals, state.swaps).active : []
  const photo = heroPhoto(state.active ? [] : exercises, now)
  const stats = weekStats(state, now)

  let eyebrow: string
  let title: string
  let subtitle: string
  if (state.active) {
    eyebrow = 'En curso'
    title = state.active.sessionName
    subtitle = 'Tu entrenamiento te espera donde lo dejaste.'
  } else if (session) {
    eyebrow = doneToday ? 'Hecho hoy ✓' : isToday ? 'Toca hoy' : 'Sesión elegida'
    title = session.name
    subtitle =
      exercises.length === 0
        ? 'Desactivada hasta que un profesional la apruebe (Ajustes).'
        : `${exercises.length} ejercicios${session.estimate ? ` · ${session.estimate}` : ''}`
  } else {
    eyebrow = 'Descanso'
    title = 'Recupera hoy'
    subtitle = restLabel ?? 'Día de descanso'
  }

  return (
    <section className="relative -mx-4 -mt-6 overflow-hidden bg-stage px-5 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-7 text-white sm:mx-0 sm:mt-0 sm:rounded-3xl">
      {photo && (
        <img
          src={photo}
          alt=""
          className="absolute inset-0 size-full object-cover opacity-45 grayscale contrast-125"
          aria-hidden
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-stage via-stage/75 to-stage/35" aria-hidden />

      <div className="relative">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-white/70">{label}</p>
          <button
            className="shrink-0 rounded-[28px] border-[1.5px] border-white/60 px-3.5 py-1.5 text-sm font-medium active:bg-white/10"
            onClick={onPlanDays}
          >
            Elegir días
          </button>
        </div>

        <p className="eyebrow mt-20 text-emerald-400">{eyebrow}</p>
        <h1 className="mt-1 text-[44px] leading-[1.07] font-light tracking-[-0.008em]">{title}</h1>
        <p className="mt-2 text-white/70">{subtitle}</p>

        <div className="mt-6 flex gap-2">
          {state.active ? (
            <button className="btn-primary flex-1 py-4 text-lg" onClick={onResume}>
              Continuar
            </button>
          ) : session && exercises.length > 0 ? (
            <button className="btn-primary flex-1 py-4 text-lg" onClick={onStart}>
              {doneToday ? 'Repetir' : 'Empezar'}
            </button>
          ) : (
            <button className="btn-primary flex-1 py-4 text-lg" onClick={onCore}>
              {coreDone ? 'Repetir el core diario' : 'Hacer el core diario'}
            </button>
          )}
        </div>

        <dl className="mt-7 grid grid-cols-3 border-t border-white/15 pt-4 text-center">
          <Stat value={`${stats.done}/${stats.planned}`} label="Esta semana" />
          <Stat value={stats.streak ? `${stats.streak}` : '–'} label={stats.streak === 1 ? 'Día seguido' : 'Días seguidos'} />
          <Stat value={stats.kcal ? stats.kcal.toLocaleString('es') : '–'} label="Kcal semana" />
        </dl>
      </div>
    </section>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt className="sr-only">{label}</dt>
      <dd className="text-2xl font-light tabular-nums">{value}</dd>
      <dd className="eyebrow mt-0.5 text-[10px] text-white/60">{label}</dd>
    </div>
  )
}

/** Foto de fondo: la del primer ejercicio de la sesión que tenga imagen (o la del core del día) */
function heroPhoto(exercises: { id: string }[], now: Date) {
  const id = [...exercises.map((e) => e.id), coreExerciseFor(now).id, 'pushup-inclinado'].find(
    (x) => EXERCISE_IMAGES[x],
  )
  return id ? `${import.meta.env.BASE_URL}exercises/${EXERCISE_IMAGES[id].folder}/0.jpg` : undefined
}

/** Sesiones de la semana (sin contar el core), días seguidos entrenando y calorías de la semana */
function weekStats(state: AppState, now: Date) {
  const key = weekKey(now)
  const finished = state.history.filter((w) => w.finishedAt)
  const thisWeek = finished.filter((w) => weekKey(new Date(w.startedAt)) === key)
  const planned = planWeek(weekPlanOf(state), state.weekPlans[key]).filter((d) => d.session).length
  const done = thisWeek.filter((w) => w.sessionId !== 'core').length
  const kcal = Math.round(
    thisWeek.reduce((n, w) => {
      const kg = w.bodyWeight ?? state.bodyWeight
      return n + (kg ? estimateCalories(w, kg).kcal : 0)
    }, 0),
  )
  // Racha: días seguidos con algo hecho, terminando hoy (o ayer si hoy todavía no)
  const days = new Set(finished.map((w) => new Date(w.startedAt).toDateString()))
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (!days.has(day.toDateString())) day.setDate(day.getDate() - 1)
  let streak = 0
  while (days.has(day.toDateString())) {
    streak++
    day.setDate(day.getDate() - 1)
  }
  return { done, planned, streak, kcal }
}

/** Calorías estimadas del día: suma de las sesiones terminadas hoy */
function DayCalories({ state, now, onOpenSettings }: { state: AppState; now: Date; onOpenSettings: () => void }) {
  const today = state.history.filter((w) => w.finishedAt && new Date(w.startedAt).toDateString() === now.toDateString())
  if (today.length === 0) return null
  const rows = today.map((w) => {
    const kg = w.bodyWeight ?? state.bodyWeight
    return { w, est: kg ? estimateCalories(w, kg) : undefined }
  })
  if (rows.some((r) => !r.est)) {
    return (
      <button className="card block w-full text-left text-sm text-muted" onClick={onOpenSettings}>
        Agrega tu peso en <b>Ajustes</b> para ver las calorías quemadas hoy.
      </button>
    )
  }
  const kcal = rows.reduce((n, r) => n + (r.est?.kcal ?? 0), 0)
  const minutes = rows.reduce((n, r) => n + (r.est?.minutes ?? 0), 0)
  return (
    <section className="card">
      <p className="text-sm text-muted">Calorías de hoy (estimación)</p>
      <p className="mt-1 text-4xl font-semibold">
        {Math.round(kcal).toLocaleString('es')}
        <span className="ml-1 text-lg font-medium text-muted">kcal</span>
      </p>
      <p className="text-sm text-muted">
        {Math.round(minutes)}' de actividad · {rows.length} {rows.length === 1 ? 'sesión' : 'sesiones'}
      </p>
      <ul className="mt-3 divide-y divide-line">
        {rows.map(({ w, est }) => (
          <li key={w.id} className="flex justify-between gap-3 py-2 text-sm">
            <span>{w.sessionName}</span>
            <span className="shrink-0 tabular-nums">
              {Math.round(est?.kcal ?? 0)} kcal <span className="text-muted">· {Math.round(est?.minutes ?? 0)}'</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function CoreCard({ now, done, onStart }: { now: Date; done: boolean; onStart: () => void }) {
  const ex = coreExerciseFor(now)
  const img = EXERCISE_IMAGES[ex.id]
  // Los próximos días de la rotación, para saber qué viene
  const next = [1, 2].map((n) => coreExerciseFor(new Date(now.getFullYear(), now.getMonth(), now.getDate() + n)))
  return (
    <section className="card">
      <div className="flex items-center gap-4">
        {img && (
          <img
            src={`${import.meta.env.BASE_URL}exercises/${img.folder}/0.jpg`}
            alt=""
            className="size-20 shrink-0 rounded-md object-cover grayscale"
            aria-hidden
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-emerald-600 dark:text-emerald-400">Core del día {done && '· hecho ✓'}</p>
          <h2 className="mt-0.5 font-medium leading-snug">{ex.name}</h2>
          <p className="text-sm text-muted tabular-nums">
            {formatTarget(ex.target, ex.sets)} · ~5'
          </p>
        </div>
      </div>
      <button className={`${done ? 'btn-ghost' : 'btn-primary'} mt-4 w-full py-3`} onClick={onStart}>
        {done ? 'Repetir el core' : 'Hacer el core'}
      </button>
      <p className="mt-3 text-xs text-muted">
        Uno por día, también los de descanso. Mañana: {next[0].name.split(' (')[0]} · pasado: {next[1].name.split(' (')[0]}.
      </p>
    </section>
  )
}

const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0]
const dateFmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short' })

function WeekPlanner({
  state,
  now,
  onWeekPlan,
  openRequest,
}: {
  state: AppState
  now: Date
  onWeekPlan: (key: string, days: number[] | undefined) => void
  /** Cambia cuando se pide abrir el selector desde fuera de la tarjeta */
  openRequest: number
}) {
  const [offset, setOffset] = useState(0)
  const [editingLocal, setEditingLocal] = useState(false)
  // Pedido desde la cabecera: queda abierto hasta tocar "Listo"
  const [closedRequest, setClosedRequest] = useState(0)
  const editing = editingLocal || openRequest > closedRequest
  const setEditing = (fn: (v: boolean) => boolean) => {
    const next = fn(editing)
    setEditingLocal(next)
    if (!next) setClosedRequest(openRequest)
  }
  const cardRef = useRef<HTMLElement>(null)
  useEffect(() => {
    if (openRequest > 0) cardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [openRequest])
  const ref = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset * 7)
  const key = weekKey(ref)
  const chosen = state.weekPlans[key]
  const weekDef = weekPlanOf(state)
  const plan = planWeek(weekDef, chosen)
  const days = chosen ?? WEEK_ORDER.filter((d) => plan[d].session)
  const missing = missingSessions(weekDef, chosen)
  const monday = new Date(`${key}T00:00:00`)
  const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6)
  const today = offset === 0 ? now.getDay() : -1

  const toggle = (d: number) => {
    const next = days.includes(d) ? days.filter((x) => x !== d) : [...days, d]
    onWeekPlan(key, next)
  }

  return (
    <section ref={cardRef} className="card scroll-mt-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold">Semana ({weekDef.label})</h3>
        <button className="text-sm font-medium text-emerald-700 dark:text-emerald-400" onClick={() => setEditing((v) => !v)}>
          {editing ? 'Listo' : 'Elegir días'}
        </button>
      </div>
      <div className="mt-2 flex gap-2">
        {['Esta semana', 'Próxima semana'].map((label, i) => (
          <button key={label} className={`chip ${offset === i ? 'chip-active' : ''}`} onClick={() => setOffset(i)}>
            {label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">
        {dateFmt.format(monday)} – {dateFmt.format(sunday)}
        {chosen ? ' · días elegidos por ti' : ' · plan por defecto'}
      </p>

      {editing && (
        <div className="mt-3 rounded-xl border border-line bg-page p-3">
          <p className="text-sm font-medium">¿Qué días entrenas?</p>
          <div className="mt-2 flex justify-between gap-1">
            {WEEK_ORDER.map((d) => (
              <button
                key={d}
                aria-label={DAY_NAMES[d]}
                aria-pressed={days.includes(d)}
                className={`size-10 rounded-full border text-sm font-semibold ${
                  days.includes(d) ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-line bg-surface'
                }`}
                onClick={() => toggle(d)}
              >
                {DAY_SHORT[d]}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted">
            Las sesiones se reparten en orden ({weekDef.order.map((id) => SESSIONS[id].name).join(', ')}),
            alternando tren superior e inferior.
          </p>
          {chosen && (
            <button className="mt-2 text-xs underline" onClick={() => onWeekPlan(key, undefined)}>
              Volver al plan por defecto
            </button>
          )}
        </div>
      )}

      {programOf(state) === 'm2' && <p className="mt-2 text-xs text-muted">{M2_NOTES.functional}</p>}

      {missing.length > 0 && (
        <p className="mt-3 rounded-lg bg-amber-50 p-2 text-sm dark:bg-amber-950/40">
          ⚠️ Con {days.length} {days.length === 1 ? 'día' : 'días'} quedan fuera:{' '}
          {missing.map((id) => SESSIONS[id].name).join(', ')}.
        </p>
      )}

      <ul className="mt-3 space-y-1 text-sm">
        {WEEK_ORDER.map((d) => {
          const p = plan[d]
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

function M2WeekCard({ state, now }: { state: AppState; now: Date }) {
  const week = m2Week(state, now)
  return (
    <section className="card">
      <h3 className="font-semibold">Mes 2 · semana por semana</h3>
      {week > 4 ? (
        <p className="mt-1 text-sm text-muted">Completaste las 4 semanas del Mes 2. ¡Hora de pedir la actualización!</p>
      ) : (
        <p className="mt-1 text-sm">
          <b>Semana {week}:</b> {M2_WEEKS[week - 1]}
        </p>
      )}
      <ol className="mt-3 space-y-1 text-sm">
        {M2_WEEKS.map((w, i) => (
          <li key={w} className={i + 1 === week ? 'font-semibold' : 'text-muted'}>
            {i + 1}. {w}
          </li>
        ))}
      </ol>
      <p className="mt-2 text-xs text-muted">
        Las semanas cuentan desde tu primera sesión del Mes 2. En la semana 4 la app pone 2 series por ejercicio.
      </p>
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
