import { useEffect, useRef } from 'react'
import './DavidAttenborough.css'

export default function DavidAttenborough() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const observer = section ? new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('is-in-view')
        observer?.unobserve(section)
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -12% 0px' }) : null
    if (section) observer?.observe(section)
    return () => observer?.disconnect()
  }, [])

  return (
    <section className="speaker-feature" id="speaker-feature" ref={sectionRef} data-scroll-reveal aria-labelledby="speaker-feature-title">
      <div className="speaker-feature-content">
        <div className="speaker-feature-portrait">
          <img src="/terra/david-attenborough-cutout.png" alt="Portrait of Sir David Attenborough" />
        </div>
        <div className="speaker-feature-copy">
          <p className="speaker-feature-kicker"><span /> A LIFE IN THE NATURAL WORLD</p>
          <h2 id="speaker-feature-title">A voice for<br />the living world.</h2>
          <blockquote>“The living world is a unique and spectacular marvel.”</blockquote>
          <p className="speaker-feature-attribution">SIR DAVID ATTENBOROUGH</p>
          <a className="speaker-feature-source" href="https://learnenglish.britishcouncil.org/comment/170438" target="_blank" rel="noreferrer">FROM <i>A LIFE ON OUR PLANET</i> · 2020 <span>↗</span></a>
        </div>
      </div>
    </section>
  )
}
