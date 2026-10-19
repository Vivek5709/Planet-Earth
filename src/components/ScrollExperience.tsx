import { useEffect, useState, type ReactNode } from 'react'
import { ReactLenis } from 'lenis/react'

const lenisOptions = {
  anchors: true,
  lerp: 0.17,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 1,
}

function ScrollReveals() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const targets = new Set<HTMLElement>()
    const sceneTargets = new Set<HTMLElement>()
    const reveal = (element: HTMLElement) => {
      if (targets.has(element)) return
      targets.add(element)
      if (reducedMotion) {
        element.classList.add('is-visible')
        return
      }
      observer.observe(element)
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -4% 0px' })

    const sceneObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-scene-revealed')
        sceneObserver.unobserve(entry.target)
      })
    }, { threshold: 0.08 })

    const scan = (node: ParentNode) => {
      if (node instanceof HTMLElement && node.matches('[data-scroll-reveal]')) reveal(node)
      node.querySelectorAll<HTMLElement>('[data-scroll-reveal]').forEach(reveal)
      if (node instanceof HTMLElement && node.matches('[data-scene-reveal]')) {
        sceneTargets.add(node)
        if (reducedMotion) node.classList.add('is-scene-revealed')
        else sceneObserver.observe(node)
      }
      node.querySelectorAll<HTMLElement>('[data-scene-reveal]').forEach((element) => {
        if (sceneTargets.has(element)) return
        sceneTargets.add(element)
        if (reducedMotion) element.classList.add('is-scene-revealed')
        else sceneObserver.observe(element)
      })
    }

    scan(document)
    const mutations = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) scan(node)
      }))
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    return () => {
      mutations.disconnect()
      observer.disconnect()
      sceneObserver.disconnect()
    }
  }, [])

  return null
}

export default function ScrollExperience({ children }: { children: ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setReducedMotion(preference.matches)
    preference.addEventListener('change', updatePreference)
    return () => preference.removeEventListener('change', updatePreference)
  }, [])

  if (reducedMotion) return <>{children}<ScrollReveals /></>

  return (
    <ReactLenis root options={lenisOptions}>
      {children}
      <ScrollReveals />
    </ReactLenis>
  )
}
