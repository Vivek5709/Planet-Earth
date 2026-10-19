import { useCallback, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import './OceanMeetSection.css'

const fish = [
  { src: '/ocean/betta-white-blue.png', className: 'ocean-fish-one', depth: 80 },
  { src: '/ocean/betta-crimson.png', className: 'ocean-fish-two', depth: 80 },
  { src: '/ocean/betta-orange-blue.png', className: 'ocean-fish-three', depth: 150 },
  { src: '/ocean/betta-red-blue.png', className: 'ocean-fish-four', depth: 150 },
]

export default function OceanMeetSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const updateParallax = useCallback(() => {
    const section = sectionRef.current
    if (!section) return

    const bounds = section.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const progress = Math.max(0, Math.min(1, (viewportHeight - bounds.top) / (viewportHeight + bounds.height)))
    section.querySelectorAll<HTMLElement>('[data-parallax-depth]').forEach((fishElement) => {
      const depth = Number(fishElement.dataset.parallaxDepth) || 0
      const offset = (progress - 0.5) * depth
      fishElement.style.setProperty('--fish-parallax-y', `${offset}px`)
    })
  }, [])

  useLenis(updateParallax)

  useEffect(() => {
    updateParallax()
    window.addEventListener('resize', updateParallax)
    return () => window.removeEventListener('resize', updateParallax)
  }, [updateParallax])

  return (
    <section className="ocean-meet" ref={sectionRef} data-scroll-reveal aria-labelledby="ocean-meet-title">
      <div className="ocean-meet-background" aria-hidden="true">
        <div className="ocean-meet-background-image" />
      </div>
      <div className="ocean-meet-waterline" aria-hidden="true" />
      <div className="ocean-fish-layer" aria-hidden="true">
        {fish.slice(0, 2).map((item) => (
          <div className={`ocean-fish ${item.className}`} data-parallax-depth={item.depth} key={item.src}>
            <img className="ocean-fish-art" src={item.src} alt="" />
          </div>
        ))}
      </div>
      <div className="ocean-meet-copy">
        <p className="ocean-meet-eyebrow"><span /> A WORLD BENEATH THE SURFACE</p>
        <h2 id="ocean-meet-title">WHO WILL<br /><em>YOU MEET?</em></h2>
        <p className="ocean-meet-description">Meet the extraordinary lives moving through the deep blue.</p>
      </div>
      <div className="ocean-fish-layer ocean-fish-layer-front" aria-hidden="true">
        {fish.slice(2).map((item) => (
          <div className={`ocean-fish ${item.className}`} data-parallax-depth={item.depth} key={item.src}>
            <img className="ocean-fish-art" src={item.src} alt="" />
          </div>
        ))}
      </div>
      <span className="ocean-meet-index" aria-hidden="true">A CLOSER LOOK AT LIFE BELOW</span>
    </section>
  )
}
