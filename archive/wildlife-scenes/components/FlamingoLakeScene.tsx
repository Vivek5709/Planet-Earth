import { useRef, type PointerEvent as ReactPointerEvent } from 'react'
import './FlamingoLakeScene.css'

export default function FlamingoLakeScene() {
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
    stage.style.setProperty('--pointer-reeds-back-x', `${-x * 28}px`)
    stage.style.setProperty('--pointer-reeds-back-y', `${-y * 18}px`)
    stage.style.setProperty('--pointer-flamingo-x', `${x * 26}px`)
    stage.style.setProperty('--pointer-flamingo-y', `${y * 17}px`)
    stage.style.setProperty('--pointer-water-x', `${-x * 16}px`)
    stage.style.setProperty('--pointer-water-y', `${-y * 12}px`)
  }

  const handlePointerLeave = () => {
    const stage = stageRef.current
    if (!stage) return
    ;['bg-x', 'bg-y', 'text-x', 'text-y', 'reeds-back-x', 'reeds-back-y', 'flamingo-x', 'flamingo-y', 'water-x', 'water-y']
      .forEach((key) => stage.style.setProperty(`--pointer-${key}`, '0px'))
  }

  return (
    <section className="lake-scene-section" data-scene-reveal aria-label="Flamingo beside a tranquil lake at sunset">
      <div className="lake-scene-stage" ref={stageRef} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
        <img className="lake-scene-background" src="/lake-scene/lake-background.png" alt="" aria-hidden="true" />
        <div className="lake-scene-shade" aria-hidden="true" />

        <div className="lake-scene-text-layer">
          <p className="lake-scene-eyebrow">AT THE WATER'S EDGE <span>—</span> LAKE COUNTRY</p>
          <h2><span>LIFE</span><span className="lake-scene-subtitle">IN STILLNESS</span></h2>
          <p className="lake-scene-caption">In the shallows, every reflection holds a story.</p>
        </div>

        <div className="lake-scene-reeds lake-scene-reeds-back" aria-hidden="true">
          <img src="/lake-scene/reeds-back.png" alt="" />
        </div>
        <img className="lake-scene-flamingo" src="/lake-scene/flamingo.png" alt="Flamingo standing in shallow lake water" />

        <div className="lake-scene-water" aria-hidden="true">
          <img src="/lake-scene/water-foreground.png" alt="" />
        </div>

        <div className="lake-scene-index" aria-hidden="true"><span>04 — 06</span><span>LAKE / STILLNESS</span></div>
        <div className="lake-scene-progress" aria-hidden="true"><span /></div>
      </div>
    </section>
  )
}
