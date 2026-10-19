import { useRef, useState, type CSSProperties, type FormEvent, type WheelEvent as ReactWheelEvent } from 'react'
import { useLenis } from 'lenis/react'
import './PassBuilder.css'

const animals = [
  { name: 'Chameleon', image: '/pass-animals/chameleon.jfif' },
  { name: 'Kangaroo & Joey', image: '/pass-animals/kangaroo.jfif' },
  { name: 'Orca', image: '/pass-animals/orca.jfif' },
  { name: 'Panda', image: '/pass-animals/panda.jfif' },
  { name: 'Leopard', image: '/pass-animals/leopard.jfif' },
  { name: 'Poison Dart Frog', image: '/pass-animals/frog.jfif' },
  { name: 'Peacock', image: '/pass-animals/peacock.jfif' },
]

type GuestDetails = { name: string; email: string }

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => {
    switch (character) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case "'": return '&apos;'
      case '"': return '&quot;'
      default: return character
    }
  })
}

function fileAsDataUrl(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => typeof reader.result === 'string' ? resolve(reader.result) : reject(new Error('Could not read the animal artwork.'))
    reader.onerror = () => reject(new Error('Could not read the animal artwork.'))
    reader.readAsDataURL(file)
  })
}

export default function PassBuilder() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [guest, setGuest] = useState<GuestDetails | null>(null)
  const [selectedAnimal, setSelectedAnimal] = useState<(typeof animals)[number] | null>(null)
  const [passReady, setPassReady] = useState(false)
  const [status, setStatus] = useState('')
  const [isDownloading, setIsDownloading] = useState(false)
  const animalRail = useRef<HTMLDivElement>(null)
  const animalScrollSection = useRef<HTMLDivElement>(null)
  const lenis = useLenis()

  const handleAnimalScroll = () => {
    const rail = animalRail.current
    if (!rail) return
    const center = rail.scrollLeft + rail.clientWidth / 2
    const cards = Array.from(rail.querySelectorAll<HTMLElement>('.pass-animal-choice'))
    let closest = 0
    let closestDistance = Number.POSITIVE_INFINITY
    cards.forEach((card, index) => {
      const distance = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center)
      if (distance < closestDistance) { closest = index; closestDistance = distance }
    })
    setSelectedAnimal((current) => current?.name === animals[closest].name ? current : animals[closest])
    setPassReady(false)
  }

  const handleAnimalWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    const rail = animalRail.current
    if (!rail) return
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY
    if (!delta) return
    const atStart = rail.scrollLeft <= 0 && delta < 0
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 1 && delta > 0
    const wheelDelta = event.deltaMode === 1 ? delta * 40 : event.deltaMode === 2 ? delta * rail.clientWidth : delta
    if (atStart || atEnd) {
      event.preventDefault()
      const currentScroll = lenis?.scroll ?? window.scrollY
      if (lenis) lenis.scrollTo(currentScroll + wheelDelta, { duration: 0.45 })
      else window.scrollTo({ top: currentScroll + wheelDelta, behavior: 'smooth' })
      return
    }
    event.preventDefault()
    rail.scrollLeft += wheelDelta
  }

  const continueToAnimals = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setGuest({ name: name.trim(), email: email.trim() })
    setStatus('')
    animalScrollSection.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const createPass = () => {
    if (!guest || !selectedAnimal) return
    window.alert(`Your ${selectedAnimal.name} pass is ready to create. Payment is required to confirm your pass. Continue to the payment step after reviewing it.`)
    setPassReady(true)
    setStatus('')
    window.setTimeout(() => document.getElementById('generated-pass')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 60)
  }

  const downloadPass = async () => {
    if (!guest || !selectedAnimal || isDownloading) return
    setIsDownloading(true)
    setStatus('')
    try {
      const animalResponse = await fetch(selectedAnimal.image)
      if (!animalResponse.ok) throw new Error('Could not load the selected animal artwork.')
      const artwork = await fileAsDataUrl(await animalResponse.blob())
      const safeName = escapeXml(guest.name)
      const safeEmail = escapeXml(guest.email)
      const safeAnimal = escapeXml(selectedAnimal.name.toUpperCase())
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="680" viewBox="0 0 1200 680"><defs><linearGradient id="sea" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#08182b"/><stop offset=".58" stop-color="#173c50"/><stop offset="1" stop-color="#263c31"/></linearGradient><radialGradient id="glow"><stop stop-color="#c4e4d3" stop-opacity=".27"/><stop offset="1" stop-color="#c4e4d3" stop-opacity="0"/></radialGradient></defs><rect width="1200" height="680" rx="32" fill="url(#sea)"/><circle cx="900" cy="250" r="370" fill="url(#glow)"/><path d="M56 56h1088v568H56z" fill="none" stroke="#e8f0e8" stroke-opacity=".32"/><text x="94" y="132" fill="#b5d7ca" font-family="Montserrat,sans-serif" font-size="18" font-weight="700" letter-spacing="5">PLANET EARTH · LIVE EXPERIENCE</text><text x="94" y="280" fill="#f5f5ed" font-family="Montserrat,sans-serif" font-size="82" font-weight="700" letter-spacing="-4">YOUR WILD PASS</text><text x="94" y="352" fill="#d5e2db" font-family="Montserrat,sans-serif" font-size="24" letter-spacing="3">${safeAnimal}</text><text x="94" y="446" fill="#f5f5ed" font-family="Montserrat,sans-serif" font-size="34" font-weight="700">${safeName}</text><text x="94" y="490" fill="#c3d5cd" font-family="Montserrat,sans-serif" font-size="21">${safeEmail}</text><text x="94" y="570" fill="#b5d7ca" font-family="Montserrat,sans-serif" font-size="16" font-weight="700" letter-spacing="3">PASS ID</text><text x="94" y="610" fill="#f5f5ed" font-family="Montserrat,sans-serif" font-size="27" letter-spacing="8">----</text><image href="${artwork}" x="710" y="115" width="420" height="440" preserveAspectRatio="xMidYMid meet"/></svg>`
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `planet-earth-pass-${guest.name.trim().replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'guest'}.svg`
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setStatus('Your pass has been downloaded. Secure payment checkout will be available when ticketing opens.')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Pass download failed. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <section className="pass-builder" aria-labelledby="pass-builder-title">
      <header className="pass-builder-heading">
        <p className="pass-builder-eyebrow"><span /> MAKE IT YOURS</p>
        <h2 id="pass-builder-title">Your seat in the<br /><em>wild is waiting.</em></h2>
        <p>Start with your details, choose the animal that speaks to you, and create a pass for the experience.</p>
      </header>

      <div className="pass-animal-step" id="pass-animal-choices" aria-labelledby="pass-animal-title">
        <div className="pass-animal-heading">
          <p className="pass-step-index">02 <i>/</i> 03</p>
          <h3 id="pass-animal-title">Choose your wild side</h3>
          <p>{guest ? 'Pick one animal for your pass.' : 'Add your name and email to unlock pass generation.'}</p>
        </div>
        <div className="pass-animal-scroll" ref={animalScrollSection}>
        <div className="pass-animal-stage" onWheel={handleAnimalWheel} data-lenis-prevent="">
          <form className="pass-guest-form" id="pass-guest-details" onSubmit={continueToAnimals}>
            <label>
              <span>YOUR NAME</span>
              <input autoComplete="name" required maxLength={70} value={name} onChange={(event) => setName(event.target.value)} placeholder="Full name" />
            </label>
            <label>
              <span>EMAIL ADDRESS</span>
              <input autoComplete="email" type="email" required maxLength={120} value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
            </label>
            <button className="pass-secondary-button" type="submit">CONTINUE TO ANIMALS <span>↓</span></button>
          </form>
          <div className="pass-animal-arc" ref={animalRail} onScroll={handleAnimalScroll} role="group" aria-label="Scroll to choose an animal for your pass" tabIndex={0}>
          {animals.map((animal, index) => {
            const selectedIndex = Math.max(0, animals.findIndex((item) => item.name === selectedAnimal?.name))
            const distance = index - selectedIndex
            const scale = Math.max(.68, 1 - Math.abs(distance) * .09)
            const arcDrop = Math.min(Math.pow(Math.abs(distance), 1.35) * 22, 96)
            return (
            <button
              aria-pressed={selectedAnimal?.name === animal.name}
              className={`pass-animal-choice pass-animal-choice-${index + 1}${selectedAnimal?.name === animal.name ? ' is-selected' : ''}`}
              key={animal.name}
              onClick={(event) => {
                setSelectedAnimal(animal)
                setPassReady(false)
                setStatus('')
                const rail = animalRail.current
                const section = animalScrollSection.current
                const card = event.currentTarget
                if (rail && section) {
                  const targetLeft = card.offsetLeft - rail.clientWidth / 2 + card.offsetWidth / 2
                  rail.scrollTo({ left: targetLeft, behavior: 'smooth' })
                }
              }}
              type="button"
              style={{ transform: `translateY(${arcDrop + 100}px) rotateY(${-distance * 16}deg) rotateZ(${distance * 2.5}deg) scale(${scale})` } as CSSProperties}
            >
              <img className="pass-animal-photo" src={animal.image} alt="" />
              <span className="pass-animal-card-shade" />
              <span className="pass-animal-card-pass-label">PLANET EARTH <i>·</i> LIVE PASS</span>
              <span className="pass-animal-name">{animal.name}</span>
              <span className="pass-animal-guest-name">{name.trim() || 'YOUR NAME'}</span>
              <span className="pass-animal-guest-email">{email.trim() || 'YOUR EMAIL'}</span>
              <span className="pass-animal-card-index">0{index + 1} <i>/ 07</i></span>
            </button>
            )
          })}
          </div>
        </div>
        </div>
        <div className="pass-animal-actions">
          <span className="pass-animal-hint">{selectedAnimal ? `${selectedAnimal.name} selected · keep scrolling to explore` : 'Scroll along the arc to explore'}</span>
          <button className="pass-primary-button" disabled={!guest || !selectedAnimal} onClick={createPass} type="button">GET MY PASS <span>↗</span></button>
        </div>
      </div>

      {passReady && guest && selectedAnimal && (
        <div className="pass-result" id="generated-pass" aria-live="polite">
          <div className="generated-pass-card">
            <div className="generated-pass-details">
              <p className="generated-pass-brand">PLANET EARTH <i>·</i> LIVE EXPERIENCE</p>
              <p className="generated-pass-label">YOUR WILD PASS</p>
              <h3>{guest.name}</h3>
              <p className="generated-pass-email">{guest.email}</p>
              <p className="generated-pass-animal">YOUR ANIMAL <strong>{selectedAnimal.name}</strong></p>
              <p className="generated-pass-id-label">PASS ID</p>
              <p className="generated-pass-id">----</p>
              <span className="generated-pass-footer">A LIVE CELEBRATION OF LIFE ON EARTH</span>
            </div>
            <div className="generated-pass-art"><img src={selectedAnimal.image} alt={`${selectedAnimal.name} cutout`} /></div>
          </div>
          <p className="pass-result-note">Your pass preview is ready. Save it to keep your design.</p>
          <button className="pass-primary-button pass-payment-button" onClick={downloadPass} type="button" disabled={isDownloading}>
            {isDownloading ? 'PREPARING YOUR PASS…' : 'PROCEED TO PAYMENT'} <span>↗</span>
          </button>
          <p className="pass-checkout-status" role="status">{status}</p>
        </div>
      )}
    </section>
  )
}
