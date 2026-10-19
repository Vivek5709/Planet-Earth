import './SnakeJourney.css'

export default function SnakeJourney() {
  return (
    <section className="snake-journey" aria-label="A snake in its forest habitat" data-scroll-reveal>
      <p className="snake-journey-eyebrow">LIFE IN THE CANOPY</p>
      <div className="snake-journey-background" aria-hidden="true">WILD<br />LIFE</div>
      <div className="snake-journey-copy">
        <h2>Stillness is a survival skill.</h2>
        <p>Hidden among the leaves, a patient hunter waits for the forest to move.</p>
      </div>
      <img
        className="snake-journey-snake"
        src="/snake-branch-cutout.png"
        alt="A copper-colored snake coiled along a leafy branch"
      />
      <p className="snake-journey-caption">A WORLD HIDDEN IN PLAIN SIGHT</p>
    </section>
  )
}
