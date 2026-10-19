import { useCallback, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import TerraDusk from './components/TerraDusk'
import Ecosystems from './components/Ecosystems'
import EcosystemIntro from './components/EcosystemIntro'
import Speakers from './components/Speakers'
import EventExperience from './components/EventExperience'
import AudienceSection from './components/AudienceSection'
import ShowTopics from './components/ShowTopics'
import SnakeJourney from './components/SnakeJourney'
import OceanMeetSection from './components/OceanMeetSection'
import DavidAttenborough from './components/DavidAttenborough'
import EventInvitation from './components/EventInvitation'
import PassBuilder from './components/PassBuilder'

function App() {
  const heroRef = useRef<HTMLElement>(null)
  const planetRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const updateHeroScroll = useCallback((scrollPosition: number) => {
    const hero = heroRef.current
    const planet = planetRef.current
    const overlay = overlayRef.current
    if (!hero || !planet || !overlay) return

    const scroll = Math.min(scrollPosition, hero.offsetHeight)
    const progress = Math.min(1, scroll / Math.max(1, hero.offsetHeight))
    planet.style.setProperty('--earth-scroll-offset', `${scroll}px`)
    overlay.style.setProperty('--hero-content-drift', `${-scrollPosition * 0.32}px`)
    overlay.style.opacity = String(1 - progress * 0.82)
  }, [])

  const lenis = useLenis((instance) => updateHeroScroll(instance.scroll))
  useEffect(() => {
    updateHeroScroll(lenis?.scroll ?? window.scrollY)
    const onResize = () => updateHeroScroll(lenis?.scroll ?? window.scrollY)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [lenis, updateHeroScroll])

  return (
    <main className="page-shell">
      <div className="hero-stage">
        <section className="hero" ref={heroRef} aria-label="Earth: our planet, our story">
          <div className="hero-sky" aria-hidden="true" />
          <div className="planet-wrap" ref={planetRef} aria-label="Interactive 3D Earth. Drag to explore.">
            <TerraDusk background="transparent" size={650} stars={5} drag hover={6.8} sun="cursor" daylight={87} speed={3.2} look={{ clouds: 1.5, lights: 5, atmosphere: '#4F9BFF' }} style={{ background: 'transparent' }} />
          </div>
          <div className="hero-overlay" ref={overlayRef}>
            <header className="nav-bar">
              <a className="brand" href="#top" aria-label="Earth home" aria-disabled="true" onClick={(event) => event.preventDefault()}>
                <span className="bbc-mark" aria-label="BBC"><span>B</span><span>B</span><span>C</span></span>
                <span className="brand-title"><span>PLANET</span><span>EARTH</span></span>
              </a>
              <nav className="nav-links" aria-label="Main navigation">
                <a href="#speakers">The Speakers</a>
                <a href="#who-should-attend">The Experience</a>
                <a href="#ecosystems">Ecosystems</a>
              </nav>
              <a className="ticket-link" href="#pass-guest-details">BOOK TICKETS <span>↗</span></a>
            </header>

            <div className="hero-copy" id="top">
              <p className="eyebrow"><span className="eyebrow-line" /> A LIVE PLANETARY EXPERIENCE</p>
              <h1>OUR PLANET.<br /><em>OUR STORY.</em></h1>
              <p className="description">Journey through the wonders of our living planet, from ancient forests to the deepest oceans, in an extraordinary celebration of life on Earth.</p>
              <div className="actions">
                <a className="button button-light" href="#experience">DISCOVER THE EVENT <span>↗</span></a>
                <a className="button button-outline" href="#speakers">MEET THE SPEAKERS</a>
              </div>
              <p className="taxonomy">AN EXPLORATION OF LIFE <span>·</span> EARTH <span>·</span> OCEANS <span>·</span> WILDLIFE</p>
            </div>

            <aside className="edition" id="featured-edition" aria-label="Featured story">
              <span className="edition-number">01 <i>/</i> 03</span>
              <h2>A WORLD OF<br />LIVING WONDERS</h2>
              <span className="edition-rule" />
              <p>ONE PLANET. COUNTLESS STORIES.</p>
            </aside>
            <div className="hero-footer" id="experience">
              <span className="scroll-mark"><span /> SCROLL TO EXPLORE</span>
              <span className="footer-center">A PLANET IN MOTION <i>—</i> AN EXPERIENCE IN WONDER</span>
              <span className="footer-index">01 <i>—</i> 03</span>
            </div>
          </div>
        </section>
      </div>
      <DavidAttenborough />
      <EventInvitation />
      <OceanMeetSection />
      <Speakers />
      <EventExperience />
      <PassBuilder />
      <AudienceSection />
      <ShowTopics />
      <SnakeJourney />
      <EcosystemIntro />
      <Ecosystems />
    </main>
  )
}

export default App
