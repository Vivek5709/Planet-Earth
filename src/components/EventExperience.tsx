import { useEffect, useRef } from 'react'
import { CalendarDays, Clock3, MapPin, Timer } from 'lucide-react'
import './EventExperience.css'

// Keep event copy here until official booking details are announced.
const event = {
  date: 'To be announced',
  time: 'To be announced',
  venue: 'Venue to be announced',
  address: 'Location details to follow',
  duration: 'To be announced',
  experience: 'Wildlife, ecosystems, nature storytelling, and immersive visuals.',
}

const details = [
  { label: 'EVENT DATE', value: event.date, Icon: CalendarDays },
  { label: 'TIME', value: event.time, Icon: Clock3 },
  { label: 'VENUE', value: event.venue, Icon: MapPin },
  { label: 'DURATION', value: event.duration, Icon: Timer },
]

export default function EventExperience() {
  const filmRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const film = filmRef.current
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!film) return

    const syncPlayback = () => {
      if (motionPreference.matches) {
        film.pause()
        return
      }
      void film.play().catch(() => undefined)
    }

    syncPlayback()
    motionPreference.addEventListener('change', syncPlayback)
    return () => motionPreference.removeEventListener('change', syncPlayback)
  }, [])

  return (
    <section className="event-experience" id="event-details" data-scroll-reveal aria-labelledby="event-experience-title">
      <div className="event-experience-atmosphere" aria-hidden="true" />
      <video
        ref={filmRef}
        className="event-experience-film"
        muted
        playsInline
        loop
        preload="metadata"
        disablePictureInPicture
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260922_195107_ed3f055a-3a13-4a71-b743-e10310454246.mp4" type="video/mp4" />
      </video>
      <div className="event-experience-shade" aria-hidden="true" />
      <img className="event-experience-squirrel" src="/flying-squirrel.png" alt="" aria-hidden="true" />

      <div className="event-experience-layout">
        <div className="event-experience-intro">
          <p className="event-experience-eyebrow"><span /> THE EXPERIENCE</p>
          <p className="event-experience-index">A LIVE PLANETARY EXPERIENCE <i>—</i> 01 / 06</p>
          <h2 id="event-experience-title">A JOURNEY INTO<br />THE <em>NATURAL</em> WORLD</h2>
          <p className="event-experience-description">
            Experience the extraordinary beauty of our living planet through an immersive celebration of wildlife, ecosystems, and the stories that connect us all. Discover the wonders of nature in an unforgettable experience guided by the spirit of David Attenborough’s storytelling.
          </p>
          <div className="event-experience-actions">
            <a className="event-button event-button-primary" href="mailto:hello@earth.live?subject=Reserve%20your%20place%20%E2%80%94%20Earth%20experience">
              RESERVE YOUR PLACE <span aria-hidden="true">↗</span>
            </a>
            <a className="event-button event-button-secondary" href="#ecosystems">EXPLORE THE EXPERIENCE</a>
          </div>
          <p className="event-experience-note">Dates and booking details will be shared here when confirmed.</p>
        </div>

        <aside className="event-experience-details" aria-label="Event details">
          <div className="event-details-heading">
            <span>PLAN YOUR VISIT</span>
            <span className="event-details-coordinate">EARTH <i>·</i> OUR SHARED HOME</span>
          </div>
          <dl className="event-details-list">
            {details.map(({ label, value, Icon }) => (
              <div className="event-detail-row" key={label}>
                <dt><Icon size={15} strokeWidth={1.5} aria-hidden="true" />{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
            <div className="event-detail-row event-detail-address">
              <dt><MapPin size={15} strokeWidth={1.5} aria-hidden="true" />ADDRESS</dt>
              <dd>{event.address}</dd>
            </div>
          </dl>
          <div className="event-experience-type">
            <span>THE EXPERIENCE</span>
            <p>{event.experience}</p>
          </div>
          <div className="event-location-note">
            <span className="event-location-icon"><MapPin size={17} strokeWidth={1.5} aria-hidden="true" /></span>
            <span><strong>LOCATION TO BE ANNOUNCED</strong><small>Venue and directions will appear here once confirmed.</small></span>
          </div>
        </aside>
      </div>
      <div className="event-experience-footer"><span>ONE PLANET <i>—</i> COUNTLESS STORIES</span><span>THE EXPERIENCE <i>·</i> 01</span></div>
    </section>
  )
}
