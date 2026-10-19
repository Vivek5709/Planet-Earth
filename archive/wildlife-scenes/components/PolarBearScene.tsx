import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import './PolarBearScene.css'

export default function PolarBearScene() {
  const stageRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    stage.style.setProperty('--pointer-bg-x', `${-x * 9}px`)
    stage.style.setProperty('--pointer-bg-y', `${-y * 7}px`)
    stage.style.setProperty('--pointer-text-x', `${x * 15}px`)
    stage.style.setProperty('--pointer-text-y', `${y * 10}px`)
    stage.style.setProperty('--pointer-ice-x', `${-x * 34}px`)
    stage.style.setProperty('--pointer-ice-y', `${-y * 22}px`)
    stage.style.setProperty('--pointer-bear-x', `${x * 29}px`)
    stage.style.setProperty('--pointer-bear-y', `${y * 19}px`)
    stage.style.setProperty('--pointer-ground-x', `${-x * 17}px`)
    stage.style.setProperty('--pointer-ground-y', `${-y * 13}px`)
  }

  const handlePointerLeave = () => {
    const stage = stageRef.current
    if (!stage) return
    ;['bg-x', 'bg-y', 'text-x', 'text-y', 'ice-x', 'ice-y', 'bear-x', 'bear-y', 'ground-x', 'ground-y']
      .forEach((key) => stage.style.setProperty(`--pointer-${key}`, '0px'))
  }

  return (
    <section className="polar-scene-section" data-scene-reveal aria-label="Polar bear in Antarctica">
      <div className="polar-scene-stage" ref={stageRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <img className="polar-scene-background" src="/polar-scene/antarctic-background.png" alt="" aria-hidden="true" />
        <div className="polar-scene-shade" aria-hidden="true" />

        <div className="polar-scene-text-layer">
          <p className="polar-scene-eyebrow">LIFE AT THE EDGE <span>—</span> ANTARCTICA</p>
          <h2><span>LIFE</span><span className="polar-scene-subtitle">ENDURES</span></h2>
          <p className="polar-scene-caption">In a world of ice, resilience leaves its mark.</p>
        </div>

        <div className="polar-scene-ice" aria-hidden="true">
          <img src="/polar-scene/ice-formations.png" alt="" />
        </div>

        <img className="polar-scene-bear" src="/polar-scene/polar-bear.png" alt="Polar bear standing on Antarctic ice" />

        <div className="polar-scene-ground" aria-hidden="true">
          <img src="/polar-scene/snow-foreground.png" alt="" />
        </div>

        <div className="polar-scene-index" aria-hidden="true"><span>02 — 06</span><span>ANTARCTICA / RESILIENCE</span></div>
        <div className="polar-scene-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  )
}
