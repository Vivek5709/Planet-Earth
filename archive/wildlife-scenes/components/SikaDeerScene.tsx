import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import './SikaDeerScene.css'

export default function SikaDeerScene() {
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
    stage.style.setProperty('--pointer-grass-back-x', `${-x * 27}px`)
    stage.style.setProperty('--pointer-grass-back-y', `${-y * 18}px`)
    stage.style.setProperty('--pointer-birds-x', `${x * 36}px`)
    stage.style.setProperty('--pointer-birds-y', `${y * 22}px`)
    stage.style.setProperty('--pointer-deer-x', `${x * 25}px`)
    stage.style.setProperty('--pointer-deer-y', `${y * 16}px`)
    stage.style.setProperty('--pointer-ground-x', `${-x * 16}px`)
    stage.style.setProperty('--pointer-ground-y', `${-y * 12}px`)
  }

  const handlePointerLeave = () => {
    const stage = stageRef.current
    if (!stage) return
    ;['bg-x', 'bg-y', 'text-x', 'text-y', 'grass-back-x', 'grass-back-y', 'birds-x', 'birds-y', 'deer-x', 'deer-y', 'ground-x', 'ground-y']
      .forEach((key) => stage.style.setProperty(`--pointer-${key}`, '0px'))
  }

  return (
    <section className="deer-scene-section" data-scene-reveal aria-label="Sika deer in golden grassland">
      <div className="deer-scene-stage" ref={stageRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <img className="deer-scene-background" src="/deer-scene/savanna-background.png" alt="" aria-hidden="true" />
        <div className="deer-scene-shade" aria-hidden="true" />

        <div className="deer-scene-text-layer">
          <p className="deer-scene-eyebrow">GOLDEN GRASSLANDS <span>—</span> EAST ASIA</p>
          <h2><span>WILD</span><span className="deer-scene-subtitle">IN MOTION</span></h2>
          <p className="deer-scene-caption">Through the tall grass, a quiet presence moves.</p>
        </div>

        <div className="deer-scene-grass deer-scene-grass-back" aria-hidden="true">
          <img src="/deer-scene/golden-grass-back.png" alt="" />
        </div>
        <img className="deer-scene-birds" src="/deer-scene/flying-birds.png" alt="A flock of cranes flying over grassland" />
        <img className="deer-scene-deer" src="/deer-scene/sika-deer.png" alt="Vietnamese sika deer standing in grassland" />

        <div className="deer-scene-ground" aria-hidden="true">
          <img src="/deer-scene/grass-foreground.png" alt="" />
        </div>

        <div className="deer-scene-index" aria-hidden="true"><span>03 — 06</span><span>GRASSLAND / PRESENCE</span></div>
        <div className="deer-scene-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  )
}
