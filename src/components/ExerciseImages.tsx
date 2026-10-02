import { useState } from 'react'
import { EXERCISE_IMAGES } from '../data/routine'

export function ExerciseImages({ exerciseId }: { exerciseId: string }) {
  const [open, setOpen] = useState(false)
  const img = EXERCISE_IMAGES[exerciseId]
  if (!img) return null
  const src = (n: number) => `${import.meta.env.BASE_URL}exercises/${img.folder}/${n}.jpg`

  return (
    <div className="mt-2">
      <button className="text-sm font-medium text-emerald-700 dark:text-emerald-400" onClick={() => setOpen((v) => !v)}>
        {open ? 'Ocultar imágenes ▲' : 'Ver cómo se hace ▼'}
      </button>
      {open && (
        <figure className="mt-2">
          <div className="grid grid-cols-2 gap-2">
            {[0, 1].map((n) => (
              <div key={n}>
                <img
                  src={src(n)}
                  alt={n === 0 ? 'Posición inicial' : 'Posición final'}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-lg object-cover"
                />
                <p className="mt-0.5 text-center text-xs text-muted">{n === 0 ? 'Inicio' : 'Final'}</p>
              </div>
            ))}
          </div>
          {img.note && <figcaption className="mt-1 text-sm text-muted">ℹ️ {img.note}</figcaption>}
        </figure>
      )}
    </div>
  )
}
