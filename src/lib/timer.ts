import { useCallback, useEffect, useRef, useState } from 'react'

let audioCtx: AudioContext | undefined

/** Debe llamarse desde un toque del usuario para que el navegador permita sonar después */
export function unlockAudio() {
  try {
    audioCtx ??= new AudioContext()
    if (audioCtx.state === 'suspended') void audioCtx.resume()
  } catch {
    // Sin audio disponible
  }
}

export function beep(times = 3) {
  try {
    navigator.vibrate?.([200, 100, 200, 100, 200])
  } catch {
    // Sin vibración
  }
  if (!audioCtx) return
  for (let i = 0; i < times; i++) {
    const t = audioCtx.currentTime + i * 0.35
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.0001, t)
    gain.gain.exponentialRampToValueAtTime(0.4, t + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25)
    osc.connect(gain).connect(audioCtx.destination)
    osc.start(t)
    osc.stop(t + 0.3)
  }
}

export type TimerKind = 'rest' | 'work'

export type TimerState = {
  kind: TimerKind
  label: string
  total: number
  endsAt: number
}

/** Un único temporizador activo: descanso entre series o tiempo de trabajo (plancha, caminata) */
export function useTimer() {
  const [timer, setTimer] = useState<TimerState | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const onDone = useRef<((elapsed: number) => void) | undefined>(undefined)

  useEffect(() => {
    if (!timer) return
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (t >= timer.endsAt) {
        clearInterval(id)
        beep()
        const cb = onDone.current
        onDone.current = undefined
        setTimer(null)
        cb?.(timer.total)
      }
    }, 250)
    return () => clearInterval(id)
  }, [timer])

  const start = useCallback((kind: TimerKind, label: string, seconds: number, done?: (elapsed: number) => void) => {
    unlockAudio()
    onDone.current = done
    const t = Date.now()
    setNow(t)
    setTimer({ kind, label, total: seconds, endsAt: t + seconds * 1000 })
  }, [])

  const stop = useCallback(() => {
    onDone.current = undefined
    setTimer(null)
  }, [])

  /** Termina antes de tiempo, registrando lo que se alcanzó a hacer */
  const finish = useCallback(() => {
    if (!timer) return
    const elapsed = Math.max(1, timer.total - Math.ceil((timer.endsAt - Date.now()) / 1000))
    const cb = onDone.current
    onDone.current = undefined
    setTimer(null)
    cb?.(elapsed)
  }, [timer])

  const addSeconds = useCallback((s: number) => {
    setTimer((t) => (t ? { ...t, total: Math.max(1, t.total + s), endsAt: Math.max(Date.now() + 1000, t.endsAt + s * 1000) } : t))
  }, [])

  const remaining = timer ? Math.max(0, Math.ceil((timer.endsAt - now) / 1000)) : 0
  return { timer, remaining, start, stop, finish, addSeconds }
}

export type Timer = ReturnType<typeof useTimer>

export function formatClock(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
