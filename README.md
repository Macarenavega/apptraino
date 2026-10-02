# Apptraino

App para seguir la **Rutina Principiante de Calistenia**: Tren Superior (fuerza) + Tren Inferior (hipertrofia).

Se instala en el celular como una app (PWA) y guarda todo en el propio dispositivo, sin cuenta ni servidor.

## Qué hace

- **Hoy**: muestra la sesión que toca según el día y la fase (Superior A/B, Inferior A/B, Full body, Movilidad).
- **Ejercicios con ⚠️** (Superman, Pike push up, Peso muerto rumano a una pierna) vienen **desactivados** hasta que un profesional los apruebe. Mientras tanto, el Pike push up se reemplaza por press de hombro con banda.
- **Modo entrenamiento**: calentamiento, series con repeticiones/segundos/minutos, nivel de cada ejercicio (altura del apoyo, tensión de banda, asistencia) y notas.
- **Temporizadores**: descanso automático al marcar una serie, y cuenta regresiva para plancha y caminata.
- **Fases**: la Fase 2 se desbloquea tras 4 semanas de Fase 1 y una revisión de criterios.
- **Imágenes de referencia** (posición inicial y final) para la mayoría de los ejercicios, con aclaraciones cuando la imagen no es exactamente tu variante.
- **Historial** de entrenamientos y respaldo/restauración de datos.

## Desarrollo

```bash
npm install
npm run dev      # servidor local
npm run build    # compilación de producción
npm run lint
```

Hecho con React + TypeScript + Vite + Tailwind CSS. La rutina está en `src/data/routine.ts`.

## Publicación

Cada push a `main` publica la app en GitHub Pages (`.github/workflows/deploy.yml`).

## Créditos

Imágenes de ejercicios de [free-exercise-db](https://github.com/yuhonas/free-exercise-db) (dominio público, Unlicense), en `public/exercises/`.
