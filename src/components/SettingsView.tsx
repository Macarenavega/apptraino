import {
  CAUTIONS,
  M2_PROGRESSIONS,
  M2_START,
  PROGRAM_NAMES,
  alternativeName,
  groupName,
  type CautionId,
  type ProgramId,
} from '../data/routine'
import { programOf, type AppState } from '../lib/store'

type Props = {
  state: AppState
  update: (fn: (s: AppState) => AppState) => void
}

export function SettingsView({ state, update }: Props) {
  const toggle = (id: CautionId, value: boolean) => {
    if (value && !confirm(`¿Un profesional aprobó "${CAUTIONS[id].exercise}"?`)) return
    update((s) => ({ ...s, approvals: { ...s.approvals, [id]: value } }))
  }

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `apptraino-respaldo-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importData = async (file: File) => {
    try {
      const data = JSON.parse(await file.text()) as AppState
      if (data.version !== 1 || !Array.isArray(data.history)) throw new Error()
      if (confirm('Esto reemplaza todos tus datos actuales. ¿Continuar?')) update(() => data)
    } catch {
      alert('El archivo no es un respaldo válido de Apptraino.')
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-[32px] leading-tight font-light">Ajustes</h1>

      {programOf(state) === 'm1' && (
    <section className="card">
          <h2 className="font-semibold">Ejercicios con ⚠️</h2>
          <p className="mt-1 text-sm text-muted">
            Hay una molestia en el sacro y una protrusión cervical reportadas. Activa cada ejercicio solo cuando un
            traumatólogo o fisioterapeuta confirme que está permitido.
          </p>
          <ul className="mt-3 divide-y divide-line">
            {(Object.keys(CAUTIONS) as CautionId[]).map((id) => (
              <li key={id} className="flex items-center gap-3 py-3">
                <div className="flex-1">
                  <p className="font-medium">{CAUTIONS[id].exercise}</p>
                  <p className="text-sm text-muted">{CAUTIONS[id].reason}</p>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="size-5 accent-emerald-600"
                    checked={state.approvals[id]}
                    onChange={(e) => toggle(id, e.target.checked)}
                  />
                  Aprobado
                </label>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <h2 className="font-semibold">Programa</h2>
        <p className="mt-1 text-sm text-muted">
          Cambiar de programa no borra nada: el historial se conserva y los ejercicios que se repiten recuerdan tu nivel.
        </p>
        <div className="mt-3 space-y-2">
          {(Object.keys(PROGRAM_NAMES) as ProgramId[]).map((id) => {
            const current = programOf(state) === id
            return (
              <button
                key={id}
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm ${
                  current ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40' : 'border-line bg-surface'
                }`}
                aria-pressed={current}
                onClick={() => update((s) => ({ ...s, program: id }))}
              >
                <span className="font-medium">{PROGRAM_NAMES[id].name}</span>
                {current && <span className="text-emerald-700 dark:text-emerald-400"> · en uso</span>}
                <span className="block text-muted">{PROGRAM_NAMES[id].description}</span>
              </button>
            )
          })}
        </div>
        {programOf(state) === 'm1' && (
          <>
            <p className="mt-3 text-sm text-muted">
              Estás en Fase {state.phase}.
              {state.phase === 2 && ' Si aparece dolor articular o te cuesta sostener el volumen, puedes volver a Fase 1.'}
            </p>
            {state.phase === 2 && (
              <button className="btn-ghost mt-2" onClick={() => update((s) => ({ ...s, phase: 1 }))}>
                Volver a Fase 1
              </button>
            )}
          </>
        )}
      </section>

      <section className="card">
        <h2 className="font-semibold">Tu peso</h2>
        <p className="mt-1 text-sm text-muted">Se usa para estimar las calorías quemadas en cada sesión.</p>
        <label className="mt-3 flex items-center gap-2">
          <input
            type="number"
            inputMode="decimal"
            min={30}
            max={250}
            className="input w-28 text-center"
            placeholder="kg"
            aria-label="Peso en kg"
            value={state.bodyWeight ?? ''}
            onChange={(e) =>
              update((s) => ({ ...s, bodyWeight: e.target.value === '' ? undefined : Number(e.target.value) }))
            }
          />
          <span className="text-sm text-muted">kg</span>
        </label>
      </section>

      <section className="card">
        <h2 className="font-semibold">Ejercicios reemplazados</h2>
        <p className="mt-1 text-sm text-muted">
          Si no tienes el material de un ejercicio (por ejemplo bandas elásticas en el gimnasio), toca{' '}
          <b>⇄ Cambiar</b> durante el entrenamiento y elige otra opción. Tu elección se recuerda para las próximas
          sesiones.
        </p>
        {Object.keys(state.swaps).length === 0 ? (
          <p className="mt-2 text-sm text-muted italic">Ningún ejercicio reemplazado por ahora.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {Object.entries(state.swaps).map(([group, altId]) => (
              <li key={group} className="flex items-center gap-3 py-2 text-sm">
                <div className="flex-1">
                  <p className="font-medium">{alternativeName(altId) ?? altId}</p>
                  <p className="text-muted">en lugar de: {groupName(group)}</p>
                </div>
                <button
                  className="btn-ghost px-3 py-1 text-sm"
                  onClick={() =>
                    update((s) => {
                      const swaps = { ...s.swaps }
                      delete swaps[group]
                      return { ...s, swaps }
                    })
                  }
                >
                  Volver al original
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {programOf(state) === 'm2' ? (
        <>
          <section className="card">
            <h2 className="font-semibold">Progresión de nivel (Mes 2)</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {M2_PROGRESSIONS.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
          <section className="card">
            <h2 className="font-semibold">Punto de partida (marcas del Mes 1)</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
              {M2_START.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        </>
      ) : (
      <section className="card">
          <h2 className="font-semibold">Progresión de carga</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            <li>
              Cuando completes todas las series y reps con buena técnica y sin llegar al fallo, avanza al siguiente nivel:
              bajar la altura del apoyo (push up), aumentar la tensión de la banda o reducir la asistencia en la
              sentadilla.
            </li>
            <li>No agregues días y subas dificultad a la vez: una cosa por vez.</li>
            <li>
              Si aparece dolor articular (no confundir con agujetas normales), baja dificultad o volumen de ese ejercicio
              y avisa si persiste.
            </li>
          </ul>
        </section>
      )}

      <section className="card">
        <h2 className="font-semibold">Créditos</h2>
        <p className="mt-1 text-sm text-muted">
          Imágenes de ejercicios de{' '}
          <a className="underline" href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noreferrer">
            free-exercise-db
          </a>{' '}
          (dominio público).
        </p>
      </section>

      <section className="card">
        <h2 className="font-semibold">Tus datos</h2>
        <p className="mt-1 text-sm text-muted">
          Todo se guarda solo en este dispositivo. Haz un respaldo de vez en cuando para no perderlo.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={exportData}>
            Descargar respaldo
          </button>
          <label className="btn-ghost cursor-pointer">
            Restaurar respaldo
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) void importData(f)
                e.target.value = ''
              }}
            />
          </label>
        </div>
      </section>
    </div>
  )
}
