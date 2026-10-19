import './EcosystemIntro.css'

const habitats = ['Tropical rainforests', 'Marine worlds', 'African savannas', 'Polar frontiers', 'Ancient forests', 'Desert realms']

export default function EcosystemIntro() {
  return (
    <section className="ecosystem-intro" aria-labelledby="ecosystem-intro-title">
      <div className="ecosystem-intro-heading">
        <p className="ecosystem-intro-kicker"><span /> SIX WORLDS · ONE LIVING PLANET</p>
        <h2 id="ecosystem-intro-title">The ecosystems<br /><em>we’ll explore.</em></h2>
      </div>
      <div className="ecosystem-intro-copy">
        <p>From rain-soaked canopies to the frozen edges of the poles, discover the habitats that make our planet extraordinary—and the life that connects them all.</p>
        <ul aria-label="Ecosystems featured in the experience">
          {habitats.map((habitat, index) => <li key={habitat}><span>0{index + 1}</span>{habitat}</li>)}
        </ul>
      </div>
    </section>
  )
}
