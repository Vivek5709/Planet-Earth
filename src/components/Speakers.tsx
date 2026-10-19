import { useCallback, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import './Speakers.css'

const speakers = [
  {
    name: 'Sir David Attenborough',
    role: 'NATURAL HISTORIAN · BROADCASTER',
    intro: 'A lifetime of bringing the living world closer to audiences through landmark natural history storytelling.',
    initials: 'DA',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/David%20Attenborough.jpeg?width=1200',
    imageAlt: 'Sir David Attenborough',
    photoCredit: 'Mike Dixson · CC BY-SA 3.0',
    photoCreditUrl: 'https://commons.wikimedia.org/wiki/File:David_Attenborough.jpeg',
    profile: 'https://www.pbs.org/wnet/nature/attenborough/',
    tone: 'moss',
  },
  {
    name: 'Liz Bonnin',
    role: 'BIOCHEMIST · WILDLIFE BIOLOGIST',
    intro: 'Explores animal behavior, environmental change, and the science behind conservation.',
    initials: 'LB',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Liz%20Bonnin%20sitting%20in%20meadow%202%20Credit%20Andrew%20Crowley.jpg?width=1200',
    imageAlt: 'Liz Bonnin in a meadow',
    photoCredit: 'Andrew Crowley · CC BY-SA 4.0',
    photoCreditUrl: 'https://commons.wikimedia.org/wiki/File:Liz_Bonnin_sitting_in_meadow_2_Credit_Andrew_Crowley.jpg',
    profile: 'https://www.lizbonnin.com/bio',
    tone: 'ocean',
  },
  {
    name: 'Chris Packham',
    role: 'NATURALIST · PHOTOGRAPHER',
    intro: 'A wildlife presenter and naturalist known for making the detail and urgency of nature accessible.',
    initials: 'CP',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Chris%20Packham%202011.jpg?width=1200',
    imageAlt: 'Chris Packham',
    photoCredit: 'Graham Racher · CC BY-SA 2.0',
    photoCreditUrl: 'https://commons.wikimedia.org/wiki/File:Chris_Packham_2011.jpg',
    profile: 'https://www.bloomsbury.com/UK/author/chris-packham/',
    tone: 'fern',
  },
  {
    name: 'Steve Backshall',
    role: 'NATURALIST · EXPLORER',
    intro: 'Takes audiences into wild places through expedition-led wildlife stories and discoveries.',
    initials: 'SB',
    image: 'https://commons.wikimedia.org/wiki/Special:FilePath/Steve%20Backshall.jpg?width=1200',
    imageAlt: 'Steve Backshall',
    photoCredit: 'Darren Wilkinson · CC BY-SA 2.0',
    photoCreditUrl: 'https://commons.wikimedia.org/wiki/File:Steve_Backshall.jpg',
    profile: 'https://www.exeter.ac.uk/about/honorarygraduates/archive/2012/honorarygraduates/ceremony7/',
    tone: 'clay',
  },
  {
    name: 'Dr. Krithi Karanth',
    role: 'CONSERVATION SCIENTIST · INDIA',
    intro: 'Studies how people and wildlife share landscapes across India and Asia, and develops practical conservation programs.',
    initials: 'KK',
    image: 'https://cwsindia.org/wp-content/uploads/2025/07/2-Karanth-Headshot-R2.png',
    imageAlt: 'Dr. Krithi Karanth',
    photoCredit: 'Centre for Wildlife Studies',
    photoCreditUrl: 'https://cwsindia.org/2025-mcnulty-prize/',
    profile: 'https://cwsindia.org/chief-executive-officer-dr-krithi-k-karanth/',
    tone: 'sage',
  },
]

export default function Speakers() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<Array<HTMLElement | null>>([])
  const updateTimeline = useCallback(() => {
    const section = sectionRef.current
    const viewport = viewportRef.current
    const track = trackRef.current
    if (!section || !viewport || !track) return

    const cards = cardRefs.current.filter((card): card is HTMLElement => card !== null)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.style.height = 'auto'
      track.style.transform = 'none'
      cards.forEach((card) => {
        card.style.setProperty('--speaker-opacity', '1')
        card.style.setProperty('--speaker-blur', '0px')
        card.style.setProperty('--speaker-rise', '0px')
      })
      return
    }

    const travel = Math.max(0, track.scrollWidth - viewport.clientWidth)
    const stepDistance = window.innerHeight * 0.82
    const scrollDistance = stepDistance * (speakers.length - 1)
    section.style.height = `${viewport.clientHeight + scrollDistance}px`
    const progress = Math.min(1, Math.max(0, -section.getBoundingClientRect().top / scrollDistance))
    track.style.transform = `translate3d(${-travel * progress}px, 0, 0)`

    cards.forEach((card, index) => {
      card.style.setProperty('--speaker-opacity', '1')
      card.style.setProperty('--speaker-blur', '0px')
      card.style.setProperty('--speaker-rise', '0px')
    })
  }, [])

  const lenis = useLenis(updateTimeline)

  useEffect(() => {
    updateTimeline()
    window.addEventListener('resize', updateTimeline)
    return () => window.removeEventListener('resize', updateTimeline)
  }, [updateTimeline])

  return (
    <section className="speakers-section" id="speakers" ref={sectionRef} aria-labelledby="speakers-title">
      <div className="speakers-viewport" ref={viewportRef}>
        <div className="speakers-track" ref={trackRef}>
          {speakers.map((speaker, index) => (
            <article
              className={`speaker-slide speaker-slide-${speaker.tone}`}
              key={speaker.name}
              ref={(element) => { cardRefs.current[index] = element }}
              aria-label={`${speaker.name}, ${speaker.role.toLowerCase()}`}
              aria-labelledby={`speaker-name-${index}`}
            >
              <div className="speaker-slide-copy">
                {index === 0 ? (
                  <p className="speakers-eyebrow" id="speakers-title"><span /> SPEAKERS · PROPOSED LINE-UP</p>
                ) : (
                  <p className="speakers-eyebrow"><span /> VOICE OF THE LIVING WORLD</p>
                )}
                <p className="speaker-slide-index">0{index + 1} <i>/</i> 0{speakers.length}</p>
                <h2 id={`speaker-name-${index}`}>{speaker.name}</h2>
                <p className="speaker-slide-role">{speaker.role}</p>
                <p className="speaker-slide-intro">{speaker.intro}</p>
                <a href={speaker.profile} target="_blank" rel="noreferrer" className="speaker-slide-link">EXPLORE THEIR WORK <span>↗</span></a>
              </div>
              <div className={`speaker-slide-portrait${speaker.image ? ' has-image' : ''}`}>
                {speaker.image ? <img src={speaker.image} alt={speaker.imageAlt} /> : <span aria-hidden="true">{speaker.initials}</span>}
                {speaker.photoCredit && <a className="speaker-photo-credit" href={speaker.photoCreditUrl} target="_blank" rel="noreferrer">{speaker.photoCredit}</a>}
              </div>
            </article>
          ))}
        </div>
        <div className="speakers-footer" aria-hidden="true"><span>SCROLL TO MEET THE SPEAKERS</span><span>ONE PLANET <i>—</i> MANY VOICES</span></div>
      </div>
    </section>
  )
}
