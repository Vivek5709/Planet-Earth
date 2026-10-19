import './EventInvitation.css'

export default function EventInvitation() {
  return (
    <section className="event-invitation" aria-labelledby="event-invitation-title">
      <p className="event-invitation-eyebrow"><span /> SOMETHING WILD IS COMING</p>
      <h2 id="event-invitation-title">A night that brings<br /><em>the wild closer.</em></h2>
      <p className="event-invitation-description">
        We’re bringing the wonders of our living planet together for one unforgettable live event. Meet the voices, places and wildlife that make our world extraordinary.
      </p>
      <a className="event-invitation-cta" href="mailto:hello@earth.live?subject=Keep%20me%20updated%20about%20the%20Planet%20Earth%20event">
        COUNT ME IN <span>↗</span>
      </a>
    </section>
  )
}
