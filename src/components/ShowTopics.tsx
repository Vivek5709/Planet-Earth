import { useRef, type PointerEvent } from 'react'
import { useLenis } from 'lenis/react'
import './ShowTopics.css'

const topics = [
  'Animal behaviour and remarkable adaptations',
  'The hidden connections within ecosystems',
  'How wildlife survives a changing world',
  'Why protecting nature matters to us all',
]

export default function ShowTopics() {
  const sectionRef = useRef<HTMLElement>(null)

  useLenis(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = section.getBoundingClientRect()
    const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)))
    section.style.setProperty('--topics-scroll', `${(progress - 0.5) * 24}px`)
  })

  const moveLayers = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--topics-copy-x', `${x * -9}px`)
    event.currentTarget.style.setProperty('--topics-copy-y', `${y * -7}px`)
    event.currentTarget.style.setProperty('--topics-animal-x', `${x * 16}px`)
    event.currentTarget.style.setProperty('--topics-animal-y', `${y * 12}px`)
  }

  const resetLayers = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--topics-copy-x', '0px')
    event.currentTarget.style.setProperty('--topics-copy-y', '0px')
    event.currentTarget.style.setProperty('--topics-animal-x', '0px')
    event.currentTarget.style.setProperty('--topics-animal-y', '0px')
  }

  return (
    <section
      className="show-topics"
      id="show-topics"
      ref={sectionRef}
      data-scroll-reveal
      aria-labelledby="show-topics-title"
      onPointerMove={moveLayers}
      onPointerLeave={resetLayers}
    >
      <p className="show-topics-eyebrow"><span /> WHAT WILL YOU DISCOVER?</p>
      <div className="show-topics-giant" aria-hidden="true">LIFE</div>
      <div className="show-topics-content">
        <h2 id="show-topics-title">THE STORIES<br />THAT KEEP LIFE ALIVE.</h2>
        <p className="show-topics-intro">From extraordinary animal behaviour to the delicate balance of whole ecosystems, explore the forces that shape life on Earth.</p>
        <ul>
          {topics.map((topic, index) => (
            <li key={topic}><span>0{index + 1}</span>{topic}</li>
          ))}
        </ul>
      </div>
      <img className="show-topics-springbok" src="/springbok-dust-cutout.png" alt="A springbok pronking through the air, kicking up a plume of dust" />
      <span className="show-topics-caption">BEHAVIOUR <i>·</i> ADAPTATION <i>·</i> CONNECTION</span>
    </section>
  )
}
