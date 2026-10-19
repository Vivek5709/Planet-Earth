import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import './Ecosystems.css'

type Habitat = {
  name: string
  region: string
  image: string
  tone: string
  size: string
  intro: string
  description: string
  species: string[]
  facts: { label: string; value: string }[]
  web: [string, string, string]
}

const habitats: Habitat[] = [
  {
    name: 'Tropical Rainforests', region: 'THE GREEN HEART · 01', image: 'photo-1448375240586-882707db888b', tone: 'rainforest', size: 'wide',
    intro: 'Where every layer is alive.',
    description: 'Under a ceiling of leaves, rainforests make their own weather. Light, water and life move through a thousand interdependent layers, from the forest floor to the canopy.',
    species: ['Jaguar', 'Scarlet macaw', 'Poison dart frog'], facts: [{ label: 'Rainfall', value: 'Up to 10 m a year' }, { label: 'Canopy', value: 'A living world above' }, { label: 'Role', value: 'A vital carbon store' }], web: ['Sunlight', 'Fig tree', 'Jaguar'],
  },
  {
    name: 'Marine Worlds', region: 'THE BLUE PLANET · 02', image: 'photo-1518837695005-2083093ee35b', tone: 'marine', size: 'tall',
    intro: 'Most of our world is still unknown.',
    description: 'From sunlit reefs to the deep sea, ocean habitats connect the entire planet. Currents carry heat, nutrients and life across a vast blue wilderness.',
    species: ['Blue whale', 'Manta ray', 'Coral polyp'], facts: [{ label: 'Coverage', value: 'Over 70% of Earth' }, { label: 'Depth', value: 'Nearly 11 km at its deepest' }, { label: 'Role', value: 'Regulates our climate' }], web: ['Sunlight', 'Phytoplankton', 'Blue whale'],
  },
  {
    name: 'African Savannas', region: 'THE OPEN PLAINS · 03', image: 'photo-1516026672322-bc52d61a55d5', tone: 'savanna', size: 'standard',
    intro: 'A rhythm written in grass.',
    description: 'Seasonal rains shape an open landscape where grazers, predators and ancient migration routes sustain one another across immense distances.',
    species: ['African elephant', 'Lion', 'Plains zebra'], facts: [{ label: 'Climate', value: 'Wet and dry seasons' }, { label: 'Movement', value: 'Life follows the rain' }, { label: 'Role', value: 'Grassland carbon store' }], web: ['Sunlight', 'Savanna grass', 'Lion'],
  },
  {
    name: 'Polar Frontiers', region: 'THE FROZEN EDGE · 04', image: 'photo-1517299321609-52687d1bc55a', tone: 'polar', size: 'standard',
    intro: 'Life at the edge of the possible.',
    description: 'In the far north and south, ice is habitat, climate engine and archive. Creatures here have evolved remarkable ways to live through long darkness and extreme cold.',
    species: ['Emperor penguin', 'Arctic fox', 'Leopard seal'], facts: [{ label: 'Light', value: 'Months of polar night' }, { label: 'Habitat', value: 'Sea ice and tundra' }, { label: 'Role', value: 'Reflects solar energy' }], web: ['Sea ice algae', 'Krill', 'Penguin'],
  },
  {
    name: 'Ancient Forests', region: 'THE OLD GROWTH · 05', image: 'photo-1441974231531-c6227db76b6e', tone: 'ancient', size: 'wide',
    intro: 'A memory measured in centuries.',
    description: 'Old forests hold deep stores of carbon and shelter intricate communities. Their roots, fungi and fallen timber keep nutrients moving through a patient, living system.',
    species: ['Northern spotted owl', 'Salamander', 'Douglas fir'], facts: [{ label: 'Age', value: 'Some trees exceed 1,000 years' }, { label: 'Structure', value: 'Many generations, one forest' }, { label: 'Role', value: 'Stores carbon over time' }], web: ['Sunlight', 'Old-growth tree', 'Spotted owl'],
  },
  {
    name: 'Desert Realms', region: 'THE QUIET KINGDOM · 06', image: 'photo-1509316785289-025f5b846b35', tone: 'desert', size: 'wide',
    intro: 'A world shaped by scarcity.',
    description: 'Deserts are not empty. They are finely tuned worlds where plants, animals and people read the weather, conserve water and make the most of brief abundance.',
    species: ['Fennec fox', 'Saguaro cactus', 'Kangaroo rat'], facts: [{ label: 'Rain', value: 'Often less than 25 cm yearly' }, { label: 'Adaptation', value: 'Life conserves every drop' }, { label: 'Role', value: 'Distinctive endemic life' }], web: ['Sunlight', 'Desert grass', 'Fennec fox'],
  },
]

function Ecosystems() {
  const [selected, setSelected] = useState<Habitat | null>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const heading = headingRef.current
    const finePointer = window.matchMedia('(pointer: fine)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!heading || !finePointer || reducedMotion) return

    const background = heading.querySelector<HTMLElement>('.eco-forest-bg')
    const title = heading.querySelector<HTMLElement>('.eco-title-composition')
    const bird = heading.querySelector<HTMLElement>('.eco-bird-parallax')
    if (!background || !title || !bird) return

    const move = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const bounds = heading.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width * 2 - 1
      const y = (event.clientY - bounds.top) / bounds.height * 2 - 1
      background.style.setProperty('--parallax-x', `${-x * 8}px`)
      background.style.setProperty('--parallax-y', `${-y * 8}px`)
      title.style.setProperty('--parallax-x', `${x * 13}px`)
      title.style.setProperty('--parallax-y', `${y * 10}px`)
      bird.style.setProperty('--parallax-x', `${x * 23}px`)
      bird.style.setProperty('--parallax-y', `${y * 17}px`)
    }
    const reset = () => {
      ;[background, title, bird].forEach((layer) => {
        layer.style.setProperty('--parallax-x', '0px')
        layer.style.setProperty('--parallax-y', '0px')
      })
    }

    heading.addEventListener('pointermove', move, { passive: true })
    heading.addEventListener('pointerleave', reset, { passive: true })
    return () => {
      heading.removeEventListener('pointermove', move)
      heading.removeEventListener('pointerleave', reset)
    }
  }, [])

  useEffect(() => {
    if (!selected) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected])

  return (
    <section className="ecosystems" id="ecosystems" aria-labelledby="ecosystems-title">
      <div className="eco-shell">
        <div className="eco-heading" ref={headingRef} data-scroll-reveal>
          <div className="eco-scene-content">
            <div className="eco-forest-bg" aria-hidden="true" />
            <div className="eco-heading-shade" aria-hidden="true" />
            <p className="eco-kicker"><span /> A PLANET OF MANY WORLDS</p>
            <div className="eco-title-composition">
              <h2 id="ecosystems-title"><span className="eco-title-line eco-title-line--one">LIFE</span><span className="eco-title-line eco-title-line--two">FINDS A WAY</span></h2>
              <div className="eco-bird-parallax"><img className="eco-bird-overlay" src="/terra/migratory-bird.png" alt="A migratory bird gliding with its wings spread" /></div>
            </div>
            <div className="eco-intro">
              <span className="eco-index">01 — 06 <i>HABITATS</i></span>
              <p>Everywhere on Earth, life is connected. Explore the extraordinary places, relationships and adaptations that make our living planet whole.</p>
            </div>
          </div>
        </div>

        <div className="eco-grid" aria-label="Explore Earth's ecosystems">
          {habitats.map((habitat, index) => (
            <button
              className={`eco-panel eco-panel--${habitat.size} eco-panel--${habitat.tone}`}
              key={habitat.name}
              type="button"
              data-scroll-reveal
              style={{ '--reveal-delay': `${(index % 3) * 90}ms` } as React.CSSProperties}
              onClick={() => setSelected(habitat)}
              aria-label={`Explore ${habitat.name}`}
            >
              <img
                className="eco-image"
                src={`https://images.unsplash.com/${habitat.image}?auto=format&fit=crop&w=1500&q=85`}
                alt=""
                loading="lazy"
                onError={(event) => event.currentTarget.classList.add('eco-image--failed')}
              />
              <span className="eco-shade" />
              <span className="eco-panel-content">
                <span className="eco-region">{habitat.region}</span>
                <span className="eco-panel-title">{habitat.name}</span>
                <span className="eco-panel-bottom"><span>{habitat.intro}</span><span className="eco-open" aria-hidden="true">↗</span></span>
              </span>
            </button>
          ))}
        </div>

        <div className="eco-closing" data-scroll-reveal>
          <img className="eco-closing-squirrel" src="/footer-squirrel-cutout.png" alt="" aria-hidden="true" />
          <span className="eco-closing-mark" aria-hidden="true">✳</span>
          <p className="eco-kicker">ONE LIVING PLANET</p>
          <h3>Nothing lives<br />in isolation.</h3>
          <p className="eco-closing-copy">A forest breathes into the ocean. The ocean shapes the air above a desert. Every habitat is part of a greater story — and every species helps write it.</p>
          <span className="eco-closing-caption">PROTECTING BIODIVERSITY MEANS PROTECTING THE THREADS THAT HOLD US TOGETHER.</span>
        </div>
      </div>

      {selected && (
        <div className="eco-dialog-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null) }}>
          <section className="eco-dialog" role="dialog" aria-modal="true" aria-labelledby="eco-dialog-title" data-tone={selected.tone} data-lenis-prevent>
            <div className="eco-dialog-image">
              <img src={`https://images.unsplash.com/${selected.image}?auto=format&fit=crop&w=1600&q=90`} alt={`${selected.name} habitat`} />
              <button type="button" className="eco-dialog-close" onClick={() => setSelected(null)} aria-label="Close ecosystem details"><X size={19} /></button>
              <div className="eco-dialog-heading"><span className="eco-region">{selected.region}</span><h2 id="eco-dialog-title">{selected.name}</h2></div>
            </div>
            <div className="eco-dialog-body">
              <p className="eco-dialog-intro">{selected.intro}</p>
              <p className="eco-dialog-description">{selected.description}</p>
              <div className="eco-dialog-columns">
                <div><span className="eco-region">SPECIES OF THIS WORLD</span><ul className="eco-species">{selected.species.map((species) => <li key={species}>{species}</li>)}</ul></div>
                <div><span className="eco-region">HABITAT NOTES</span><dl className="eco-facts">{selected.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></div>
              </div>
              <div className="eco-foodweb"><span className="eco-region">A THREAD IN THE FOOD WEB</span><div className="eco-foodweb-flow">{selected.web.map((node, index) => <span className="eco-foodweb-node" key={node}>{index > 0 && <i aria-hidden="true">→</i>}{node}</span>)}</div><p>Energy moves through every living relationship.</p></div>
            </div>
          </section>
        </div>
      )}
    </section>
  )
}

export default Ecosystems
