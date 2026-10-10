import { useState } from 'react'
import { estimateCalories } from '../lib/calories'
import type { WorkoutLog } from '../lib/store'

type Props = {
  workout: WorkoutLog
  bodyWeight?: number
  onWeight: (kg: number) => void
  onClose: () => void
}

const fmtKcal = (n: number) => Math.round(n).toLocaleString('es')

/** Resumen al terminar una sesión: calorías estimadas, duración y series */
export function SummaryView({ workout, bodyWeight, onWeight, onClose }: Props) {
  const kg = workout.bodyWeight ?? bodyWeight
  const total = workout.exercises.reduce((n, e) => n + e.sets.length, 0)
  const done = workout.exercises.reduce((n, e) => n + e.sets.filter((s) => s.done).length, 0)
  const est = kg ? estimateCalories(workout, kg) : undefined

  return (
    <div className="space-y-4">
      <header>
        <p className="text-sm text-muted">Sesión terminada</p>
        <h1 className="text-2xl font-bold">{workout.sessionName}</h1>
      </header>

      {est ? (
        <>
          <section className="card text-center">
            <p className="text-sm text-muted">Calorías quemadas (estimación)</p>
            <p className="mt-1 text-6xl font-semibold">
              {fmtKcal(est.kcal)}
              <span className="ml-1 text-2xl font-medium text-muted">kcal</span>
            </p>
          </section>

          <div className="grid grid-cols-3 gap-3">
            <Tile label="Duración" value={`${Math.round(est.minutes)}'`} />
            <Tile label="Series" value={`${done}/${total}`} />
            <Tile label="Por minuto" value={est.minutes > 0 ? (est.kcal / est.minutes).toFixed(1) : '–'} unit="kcal" />
          </div>

          <section className="card">
            <h2 className="font-semibold">De dónde salen</h2>
            <ul className="mt-3 space-y-3">
              {est.parts.map((p) => (
                <li key={p.label}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span>{p.label}</span>
                    <span className="tabular-nums">
                      {fmtKcal(p.kcal)} kcal <span className="text-muted">· {Math.round(p.minutes)}'</span>
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-track">
                    <div
                      className="h-full rounded-full bg-emerald-600"
                      style={{ width: `${est.kcal > 0 ? (p.kcal / est.kcal) * 100 : 0}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">
              Calculado con METs del Compendio de Actividades Físicas (kcal = MET × {kg} kg × horas). Es una
              aproximación: depende de la intensidad y de cada persona.
              {est.estimatedDuration &&
                ' La sesión se registró en menos de 10 minutos, así que se usó la duración estimada de la sesión.'}
            </p>
          </section>
        </>
      ) : (
        <WeightPrompt onWeight={onWeight} />
      )}

      <button className="btn-primary w-full py-4 text-lg" onClick={onClose}>
        Listo
      </button>
    </div>
  )
}

function Tile({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div className="card p-3 text-center">
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold">
        {value}
        {unit && <span className="ml-0.5 text-xs font-normal text-muted">{unit}</span>}
      </p>
    </div>
  )
}

export function WeightPrompt({ onWeight }: { onWeight: (kg: number) => void }) {
  const [value, setValue] = useState('')
  const kg = Number(value)
  const valid = kg >= 30 && kg <= 250
  return (
    <section className="card">
      <h2 className="font-semibold">Para calcular las calorías necesito tu peso</h2>
      <p className="mt-1 text-sm text-muted">Se guarda solo en este dispositivo. Puedes cambiarlo en Ajustes.</p>
      <div className="mt-3 flex items-center gap-2">
        <input
          type="number"
          inputMode="decimal"
          min={30}
          max={250}
          className="input w-28 text-center"
          placeholder="kg"
          aria-label="Peso en kg"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <span className="text-sm text-muted">kg</span>
        <button className="btn-primary ml-auto" disabled={!valid} onClick={() => onWeight(kg)}>
          Calcular
        </button>
      </div>
    </section>
  )
}
