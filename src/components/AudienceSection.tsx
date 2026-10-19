import { useRef, type PointerEvent } from 'react'
import { useLenis } from 'lenis/react'
import './AudienceSection.css'

export default function AudienceSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useLenis(() => {
    const section = sectionRef.current
    if (!section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = section.getBoundingClientRect()
    const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)))
    section.style.setProperty('--audience-scroll', `${(progress - 0.5) * 24}px`)
  })

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    event.currentTarget.style.setProperty('--audience-text-x', `${x * -10}px`)
    event.currentTarget.style.setProperty('--audience-text-y', `${y * -7}px`)
    event.currentTarget.style.setProperty('--audience-elephant-x', `${x * 18}px`)
    event.currentTarget.style.setProperty('--audience-elephant-y', `${y * 12}px`)
  }

  const resetPointer = (event: PointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--audience-text-x', '0px')
    event.currentTarget.style.setProperty('--audience-text-y', '0px')
    event.currentTarget.style.setProperty('--audience-elephant-x', '0px')
    event.currentTarget.style.setProperty('--audience-elephant-y', '0px')
  }

  return (
    <section
      className="audience-section"
      id="who-should-attend"
      ref={sectionRef}
      data-scroll-reveal
      aria-labelledby="audience-title"
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <p className="audience-eyebrow"><span /> WHO SHOULD EXPERIENCE THIS?</p>
      <div className="audience-copy">
        <h2 id="audience-title">FOR THE<br /><em>CURIOUS.</em></h2>
        <p>
          For young explorers, families, lifelong wildlife lovers, and anyone who wants to feel closer to the natural world. Come curious; leave seeing our shared planet in a new way.
        </p>
        <span className="audience-signoff">ONE PLANET. A MILLION REASONS TO LOOK CLOSER.</span>
      </div>
      <div className="audience-elephant-wrap" aria-hidden="true">
        <img src="/elephant-cutout.png" alt="" className="audience-elephant" />
      </div>
      <span className="audience-coordinate" aria-hidden="true">NATURE IS FOR EVERYONE <i>—</i> 02</span>
    </section>
  )
}
