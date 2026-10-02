import { CAUTIONS, type CautionId } from '../data/routine'
import type { AppState } from '../lib/store'

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
      <h1 className="text-2xl font-bold">Ajustes</h1>

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

      <section className="card">
        <h2 className="font-semibold">Fase</h2>
        <p className="mt-1 text-sm text-muted">
          Estás en Fase {state.phase}.
          {state.phase === 2 && ' Si aparece dolor articular o te cuesta sostener el volumen, puedes volver a Fase 1.'}
        </p>
        {state.phase === 2 && (
          <button className="btn-ghost mt-2" onClick={() => update((s) => ({ ...s, phase: 1 }))}>
            Volver a Fase 1
          </button>
        )}
      </section>

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
