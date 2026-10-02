import { useState } from 'react'
import { HistoryView } from './components/HistoryView'
import { SettingsView } from './components/SettingsView'
import { TimerBar } from './components/TimerBar'
import { TodayView } from './components/TodayView'
import { WorkoutView } from './components/WorkoutView'
import { WARMUP } from './data/routine'
import { newWorkout, useAppState } from './lib/store'
import { unlockAudio, useTimer } from './lib/timer'

type Tab = 'today' | 'history' | 'settings'

export default function App() {
  const [state, update] = useAppState()
  const [tab, setTab] = useState<Tab>('today')
  const [inWorkout, setInWorkout] = useState(false)
  const timer = useTimer()

  return (
    <div className="min-h-dvh pb-40">
      <main className="mx-auto max-w-xl px-4 pt-6">
        {tab === 'today' && inWorkout && state.active ? (
          <WorkoutView
            workout={state.active}
            approvals={state.approvals}
            timer={timer}
            onChange={(fn) => update((s) => (s.active ? { ...s, active: fn(s.active) } : s))}
            onDiscard={() => {
              timer.stop()
              update((s) => ({ ...s, active: undefined }))
              setInWorkout(false)
            }}
            onFinish={() => {
              update((s) => {
                if (!s.active) return s
                const finished = { ...s.active, finishedAt: new Date().toISOString() }
                const lastLevels = { ...s.lastLevels }
                for (const e of finished.exercises) if (e.level.trim()) lastLevels[e.exerciseId] = e.level.trim()
                return {
                  ...s,
                  active: undefined,
                  history: [...s.history, finished],
                  lastLevels,
                  startDate: s.startDate ?? finished.startedAt,
                }
              })
              setInWorkout(false)
            }}
          />
        ) : tab === 'today' ? (
          <TodayView
            state={state}
            onStart={(id) => {
              unlockAudio()
              update((s) => ({ ...s, active: newWorkout(s, id, WARMUP.length) }))
              setInWorkout(true)
            }}
            onResume={() => setInWorkout(true)}
            onPhase2={() => update((s) => ({ ...s, phase: 2 }))}
            onOpenSettings={() => setTab('settings')}
          />
        ) : tab === 'history' ? (
          <HistoryView
            history={state.history}
            onDelete={(id) => update((s) => ({ ...s, history: s.history.filter((w) => w.id !== id) }))}
          />
        ) : (
          <SettingsView state={state} update={update} />
        )}
      </main>

      <TimerBar timer={timer} />

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface pb-[env(safe-area-inset-bottom)]">
        <div className="mx-auto flex max-w-xl">
          {(
            [
              ['today', state.active ? 'Entrenando' : 'Hoy', '🏋️'],
              ['history', 'Historial', '📅'],
              ['settings', 'Ajustes', '⚙️'],
            ] as const
          ).map(([id, label, icon]) => (
            <button
              key={id}
              className={`flex h-16 flex-1 flex-col items-center justify-center gap-0.5 text-xs ${
                tab === id ? 'font-semibold text-emerald-600 dark:text-emerald-400' : 'text-muted'
              }`}
              onClick={() => {
                setTab(id)
                if (id === 'today' && state.active) setInWorkout(true)
              }}
            >
              <span className="text-xl" aria-hidden>
                {icon}
              </span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </div>
  )
}
