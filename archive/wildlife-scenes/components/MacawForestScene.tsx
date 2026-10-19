import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import './MacawForestScene.css'

export default function MacawForestScene() {
  const stageRef = useRef<HTMLDivElement>(null)

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const stage = stageRef.current
    if (!stage) return
    const rect = stage.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    stage.style.setProperty('--pointer-bg-x', `${-x * 10}px`)
    stage.style.setProperty('--pointer-bg-y', `${-y * 7}px`)
    stage.style.setProperty('--pointer-text-x', `${x * 16}px`)
    stage.style.setProperty('--pointer-text-y', `${y * 10}px`)
    stage.style.setProperty('--pointer-back-x', `${-x * 30}px`)
    stage.style.setProperty('--pointer-back-y', `${-y * 20}px`)
    stage.style.setProperty('--pointer-front-x', `${-x * 42}px`)
    stage.style.setProperty('--pointer-front-y', `${-y * 28}px`)
    stage.style.setProperty('--pointer-bird-x', `${x * 30}px`)
    stage.style.setProperty('--pointer-bird-y', `${y * 20}px`)
    stage.style.setProperty('--pointer-perched-x', `${x * -19.5}px`)
    stage.style.setProperty('--pointer-perched-y', `${y * -11}px`)
    stage.style.setProperty('--pointer-ground-y', `${-y * 12}px`)
  }

  const handlePointerLeave = () => {
    const stage = stageRef.current
    if (!stage) return
    ;['bg-x', 'bg-y', 'text-x', 'text-y', 'back-x', 'back-y', 'front-x', 'front-y', 'bird-x', 'bird-y', 'perched-x', 'perched-y', 'ground-y']
      .forEach((key) => stage.style.setProperty(`--pointer-${key}`, '0px'))
  }

  return (
    <section className="macaw-scene-section" data-scene-reveal aria-label="Macaws in the rainforest canopy">
      <div className="macaw-scene-stage" ref={stageRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <img className="macaw-scene-background" src="/macaw-scene/rainforest-bokeh.png" alt="" aria-hidden="true" />
        <div className="macaw-scene-shade" aria-hidden="true" />

        <div className="macaw-scene-text-layer">
          <p className="macaw-scene-eyebrow">A CANOPY IN MOTION <span>—</span> AMAZONIA</p>
          <h2><span>LIFE</span><span className="macaw-scene-subtitle">FINDS A WAY</span></h2>
          <p className="macaw-scene-caption">Above the forest floor, colour takes flight.</p>
        </div>

        <div className="macaw-scene-foliage macaw-scene-foliage-back" aria-hidden="true">
          <img src="/macaw-scene/tropical-bush.png" alt="" />
        </div>
        <div className="macaw-scene-foliage macaw-scene-foliage-mid" aria-hidden="true">
          <img src="/macaw-scene/flora-layer.png" alt="" />
        </div>

        <img className="macaw-scene-flight" src="/macaw-scene/macaws-flying.png" alt="Two scarlet macaws in flight" />
        <img className="macaw-scene-perched" src="/macaw-scene/macaw-perched.png" alt="Scarlet macaw perched on a branch" />

        <div className="macaw-scene-floor" aria-hidden="true">
          <img src="/macaw-scene/forest-floor.png" alt="" />
        </div>

        <div className="macaw-scene-index" aria-hidden="true"><span>01 — 06</span><span>RAINFOREST / FLIGHT</span></div>
        <div className="macaw-scene-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  )
}
