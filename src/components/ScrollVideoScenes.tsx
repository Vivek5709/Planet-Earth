import { useCallback, useEffect, useRef } from 'react'
import { useLenis } from 'lenis/react'
import frameManifest from './frame-manifest.json'
import './ScrollVideoScenes.css'

const sequences = [frameManifest.first, frameManifest.second]
const allFrames = sequences.flat()
const secondSequenceStart = sequences[0].length
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const neighborhood = 8
const timelineScale = 6 / 7
const openingEnd = (1 / 6) * timelineScale
const firstSequenceEnd = 0.5 * timelineScale
const secondOpeningEnd = (2 / 3) * timelineScale
const finalSceneStart = 6 / 7

export default function ScrollVideoScenes() {
  const lenis = useLenis()
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const currentFrameRef = useRef(0)
  const imagesRef = useRef(new Map<number, HTMLImageElement>())
  const requestedRef = useRef(new Set<number>())
  const failedRef = useRef(new Set<number>())
  const sequenceIndexRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef(0)
  const renderRef = useRef<() => void>(() => undefined)
  const loadNeighborhoodRef = useRef<(index: number) => void>(() => undefined)

  const render = useCallback(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d', { alpha: false })
    if (!canvas || !context) return

    const width = canvas.clientWidth
    const height = canvas.clientHeight
    if (!width || !height) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const pixelWidth = Math.round(width * dpr)
    const pixelHeight = Math.round(height * dpr)
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
    }

    const target = currentFrameRef.current
    let image = imagesRef.current.get(target)
    if (!image?.complete || !image.naturalWidth) {
      let closestDistance = Number.POSITIVE_INFINITY
      imagesRef.current.forEach((candidate, index) => {
        if (!candidate.complete || !candidate.naturalWidth) return
        const distance = Math.abs(index - target)
        if (distance < closestDistance) {
          closestDistance = distance
          image = candidate
        }
      })
    }
    if (!image?.complete || !image.naturalWidth) return

    context.setTransform(dpr, 0, 0, dpr, 0, 0)
    // Cover the complete stage while preserving the source aspect ratio.
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight)
    const drawWidth = image.naturalWidth * scale
    const drawHeight = image.naturalHeight * scale
    context.clearRect(0, 0, width, height)
    context.drawImage(image, (width - drawWidth) / 2, (height - drawHeight) / 2, drawWidth, drawHeight)
  }, [])

  renderRef.current = render

  const requestFrame = useCallback((index: number) => {
    if (index < 0 || index >= allFrames.length || requestedRef.current.has(index) || failedRef.current.has(index)) return
    requestedRef.current.add(index)
    const image = new Image()
    imagesRef.current.set(index, image)
    image.onload = () => {
      loadNeighborhoodRef.current(currentFrameRef.current)
      renderRef.current()
    }
    image.onerror = () => {
      failedRef.current.add(index)
      imagesRef.current.delete(index)
      renderRef.current()
    }
    image.src = allFrames[index]
  }, [])

  const loadNeighborhood = useCallback((index: number) => {
    requestFrame(index)
    for (let offset = 1; offset <= neighborhood; offset += 1) {
      requestFrame(index - offset)
      requestFrame(index + offset)
    }
    // Drop far-away decoded images so the sequence does not retain hundreds of full-size bitmaps.
    imagesRef.current.forEach((image, frameIndex) => {
      if (Math.abs(frameIndex - index) <= neighborhood * 2 || !image.complete) return
      image.onload = null
      image.onerror = null
      imagesRef.current.delete(frameIndex)
      requestedRef.current.delete(frameIndex)
    })
  }, [requestFrame])

  loadNeighborhoodRef.current = loadNeighborhood

  const updateFromScroll = useCallback(() => {
    const section = sectionRef.current
    if (!section) return
    const bounds = section.getBoundingClientRect()
    const sectionStart = window.scrollY + bounds.top
    const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight)
    const progress = Math.max(0, Math.min(1, (window.scrollY - sectionStart) / scrollRange))
    const reduceMotion = window.matchMedia(reducedMotionQuery).matches
    let frame = 0
    if (!reduceMotion && progress > openingEnd && progress <= firstSequenceEnd) {
      const firstProgress = (progress - openingEnd) / (firstSequenceEnd - openingEnd)
      frame = Math.round(firstProgress * (sequences[0].length - 1))
    } else if (!reduceMotion && progress > firstSequenceEnd && progress <= secondOpeningEnd) {
      // Keep the first sequence's final image underneath the monkey scene
      // until the next frame run begins.
      frame = secondSequenceStart - 1
    } else if (!reduceMotion && progress > secondOpeningEnd && progress <= finalSceneStart) {
      const secondProgress = (progress - secondOpeningEnd) / (finalSceneStart - secondOpeningEnd)
      frame = secondSequenceStart + Math.round(secondProgress * (sequences[1].length - 1))
    } else if (!reduceMotion && progress > finalSceneStart) {
      frame = allFrames.length - 1
    }

    currentFrameRef.current = frame
    const openingProgress = Math.min(1, progress / openingEnd)
    const clamp01 = (value: number) => Math.max(0, Math.min(1, value))
    const openingArtFade = clamp01((progress - 0.14 * timelineScale) / (0.05 * timelineScale))
    const monkeyArtFade = clamp01((progress - 0.65 * timelineScale) / (0.06 * timelineScale))
    // Hold the first sequence's final frame cleanly at its snap point, then
    // begin the monkey scene crossfade as the next hard-scroll leg starts.
    const monkeyArtEnter = clamp01((progress - firstSequenceEnd) / (0.03 * timelineScale))
    const finalArtEnter = clamp01((progress - finalSceneStart) / 0.025)
    const sequenceOpacity = progress < 0.14 * timelineScale
      ? 0
      : progress < 0.19 * timelineScale
        ? clamp01((progress - 0.14 * timelineScale) / (0.05 * timelineScale))
        : progress < firstSequenceEnd
          ? 1
          : progress < firstSequenceEnd + 0.03 * timelineScale
            ? 1 - clamp01((progress - firstSequenceEnd) / (0.03 * timelineScale))
            : progress < secondOpeningEnd
              ? 0
              : progress < secondOpeningEnd + 0.06 * timelineScale
                ? clamp01((progress - secondOpeningEnd) / (0.06 * timelineScale))
                : progress < finalSceneStart
                  ? 1
                  : 1 - finalArtEnter
    const monkeyOpeningProgress = clamp01((progress - firstSequenceEnd) / (secondOpeningEnd - firstSequenceEnd))
    section.style.setProperty('--sequence-progress', progress.toFixed(4))
    section.style.setProperty('--opening-progress', openingProgress.toFixed(4))
    section.style.setProperty('--opening-text-opacity', String(reduceMotion ? 0 : 1 - clamp01(progress / (0.16 * timelineScale))))
    section.style.setProperty('--opening-art-opacity', String(reduceMotion ? 0 : 1 - openingArtFade))
    section.style.setProperty('--monkey-art-opacity', String(reduceMotion ? 0 : monkeyArtEnter * (1 - monkeyArtFade)))
    section.style.setProperty('--monkey-text-opacity', String(reduceMotion ? 0 : 1 - clamp01((progress - 0.59 * timelineScale) / (0.07 * timelineScale))))
    section.style.setProperty('--final-art-opacity', String(reduceMotion ? 0 : finalArtEnter))
    section.style.setProperty('--final-text-opacity', String(reduceMotion ? 0 : 1 - clamp01((progress - 0.95) / 0.05)))
    section.style.setProperty('--sequence-opacity', String(reduceMotion ? 1 : sequenceOpacity))
    section.style.setProperty('--opening-copy-y', `${-openingProgress * 34}px`)
    section.style.setProperty('--opening-copy-blur', `${openingProgress * 12}px`)
    section.style.setProperty('--opening-bg-y', `${-openingProgress * 30}px`)
    section.style.setProperty('--opening-bird-y', `${-openingProgress * 12}px`)
    section.style.setProperty('--opening-title-scale', String(1 + openingProgress * 0.08))
    section.style.setProperty('--monkey-copy-y', `${-monkeyOpeningProgress * 20}px`)
    section.style.setProperty('--monkey-copy-blur', `${monkeyOpeningProgress * 11}px`)
    section.style.setProperty('--monkey-bg-y', `${-monkeyOpeningProgress * 22}px`)
    section.style.setProperty('--monkey-subject-y', `${-monkeyOpeningProgress * 10}px`)
    section.style.setProperty('--monkey-title-scale', String(1 + monkeyOpeningProgress * 0.06))
    const finalSceneProgress = clamp01((progress - finalSceneStart) / (1 - finalSceneStart))
    section.style.setProperty('--final-copy-y', `${-finalSceneProgress * 16}px`)
    section.style.setProperty('--final-copy-blur', `${finalSceneProgress * 9}px`)
    section.style.setProperty('--final-bg-y', `${-finalSceneProgress * 18}px`)
    section.style.setProperty('--final-subject-y', `${-finalSceneProgress * 8}px`)
    section.style.setProperty('--final-title-scale', String(1 + finalSceneProgress * 0.04))
    section.dataset.sequence = frame >= secondSequenceStart ? 'second' : 'first'
    if (sequenceIndexRef.current) sequenceIndexRef.current.textContent = frame >= secondSequenceStart ? '02' : '01'
    const preloadFrame = progress > firstSequenceEnd && progress <= secondOpeningEnd
      ? secondSequenceStart
      : progress > finalSceneStart
        ? allFrames.length - 1
        : frame
    loadNeighborhood(preloadFrame)
    renderRef.current()
  }, [loadNeighborhood])

  useEffect(() => {
    let scheduled = false
    const scheduleRender = () => {
      if (scheduled) return
      scheduled = true
      rafRef.current = requestAnimationFrame(() => {
        scheduled = false
        updateFromScroll()
      })
    }

    requestFrame(0)
    scheduleRender()
    window.addEventListener('scroll', scheduleRender, { passive: true })
    window.addEventListener('resize', scheduleRender, { passive: true })
    const motionPreference = window.matchMedia(reducedMotionQuery)
    motionPreference.addEventListener('change', scheduleRender)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('scroll', scheduleRender)
      window.removeEventListener('resize', scheduleRender)
      motionPreference.removeEventListener('change', scheduleRender)
      imagesRef.current.forEach((image) => {
        image.onload = null
        image.onerror = null
        image.src = ''
      })
      imagesRef.current.clear()
      requestedRef.current.clear()
      failedRef.current.clear()
    }
  }, [requestFrame, updateFromScroll])

  useEffect(() => {
    const section = sectionRef.current
    const stage = section?.querySelector<HTMLElement>('.scroll-video-stage')
    if (!section || !stage || !lenis || window.matchMedia(reducedMotionQuery).matches) return

    const endpoints = [0, firstSequenceEnd, finalSceneStart, 1]
    const wheelThreshold = 42
    let accumulatedDelta = 0
    let intentDirection = 0
    let snapping = false
    let cooldown = false
    let cooldownTimer = 0
    let touchStartY = 0
    let touchGestureActive = false
    let touchGestureLocked = false

    const settleCooldown = () => {
      window.clearTimeout(cooldownTimer)
      cooldownTimer = window.setTimeout(() => {
        cooldown = false
        accumulatedDelta = 0
        intentDirection = 0
      }, 220)
    }

    const snap = (direction: -1 | 1) => {
      const bounds = section.getBoundingClientRect()
      const sectionStart = window.scrollY + bounds.top
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight)
      const currentProgress = Math.max(0, Math.min(1, (lenis.scroll - sectionStart) / scrollRange))

      if ((direction > 0 && currentProgress >= 0.99) || (direction < 0 && currentProgress <= 0.01)) return false
      const endpoint = direction > 0
        ? endpoints.find((point) => point > currentProgress + 0.015)
        : [...endpoints].reverse().find((point) => point < currentProgress - 0.015)
      if (endpoint === undefined) return false

      snapping = true
      cooldown = true
      accumulatedDelta = 0
      const target = sectionStart + endpoint * scrollRange
      lenis.scrollTo(target, {
        duration: 1.25,
        easing: (value) => 1 - (1 - value) ** 4,
        lock: true,
        onComplete: () => {
          snapping = false
          settleCooldown()
        },
      })
      return true
    }

    const isStageVisible = () => {
      const bounds = stage.getBoundingClientRect()
      return bounds.bottom > 0 && bounds.top < window.innerHeight
    }

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey || !isStageVisible()) return
      const direction = Math.sign(event.deltaY)
      if (!direction) return
      const delta = event.deltaMode === WheelEvent.DOM_DELTA_LINE
        ? event.deltaY * 16
        : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
          ? event.deltaY * window.innerHeight
          : event.deltaY

      const bounds = section.getBoundingClientRect()
      const sectionStart = window.scrollY + bounds.top
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, (lenis.scroll - sectionStart) / scrollRange))
      // Let regular page scrolling leave the experience at its outer edges.
      if ((direction > 0 && progress >= 0.99) || (direction < 0 && progress <= 0.01)) return

      event.preventDefault()
      event.stopImmediatePropagation()
      if (snapping || cooldown) {
        if (!snapping) settleCooldown()
        return
      }

      if (intentDirection !== direction) {
        accumulatedDelta = 0
        intentDirection = direction
      }
      accumulatedDelta += Math.abs(delta)
      if (accumulatedDelta >= wheelThreshold) snap(direction as -1 | 1)
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (!isStageVisible() || event.altKey || event.ctrlKey || event.metaKey) return
      const target = event.target
      if (target instanceof HTMLElement && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName))) return
      const direction = ['ArrowDown', 'PageDown', ' '].includes(event.key)
        ? 1
        : ['ArrowUp', 'PageUp'].includes(event.key)
          ? -1
          : 0
      if (!direction) return

      const bounds = section.getBoundingClientRect()
      const sectionStart = window.scrollY + bounds.top
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, (lenis.scroll - sectionStart) / scrollRange))
      if ((direction > 0 && progress >= 0.99) || (direction < 0 && progress <= 0.01)) return
      event.preventDefault()
      if (!snapping && !cooldown) snap(direction as -1 | 1)
    }

    const onTouchStart = (event: TouchEvent) => {
      if (!isStageVisible() || !event.touches.length) return
      touchStartY = event.touches[0].clientY
      touchGestureActive = true
      touchGestureLocked = false
    }

    const onTouchMove = (event: TouchEvent) => {
      if (!touchGestureActive || !event.touches.length) return
      if (touchGestureLocked || snapping || cooldown) {
        event.preventDefault()
        event.stopImmediatePropagation()
        touchGestureLocked = true
        if (!snapping) settleCooldown()
        return
      }

      const delta = touchStartY - event.touches[0].clientY
      if (Math.abs(delta) < 30) return
      const direction = Math.sign(delta) as -1 | 1
      const bounds = section.getBoundingClientRect()
      const sectionStart = window.scrollY + bounds.top
      const scrollRange = Math.max(1, section.offsetHeight - window.innerHeight)
      const progress = Math.max(0, Math.min(1, (lenis.scroll - sectionStart) / scrollRange))
      if ((direction > 0 && progress >= 0.99) || (direction < 0 && progress <= 0.01)) {
        touchGestureActive = false
        return
      }

      event.preventDefault()
      event.stopImmediatePropagation()
      touchGestureLocked = true
      snap(direction)
    }

    const onTouchEnd = () => {
      touchGestureActive = false
      touchGestureLocked = false
    }

    window.addEventListener('wheel', onWheel, { passive: false, capture: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('touchstart', onTouchStart, { passive: true, capture: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false, capture: true })
    window.addEventListener('touchend', onTouchEnd, { passive: true, capture: true })
    window.addEventListener('touchcancel', onTouchEnd, { passive: true, capture: true })
    return () => {
      window.clearTimeout(cooldownTimer)
      window.removeEventListener('wheel', onWheel, true)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('touchstart', onTouchStart, true)
      window.removeEventListener('touchmove', onTouchMove, true)
      window.removeEventListener('touchend', onTouchEnd, true)
      window.removeEventListener('touchcancel', onTouchEnd, true)
    }
  }, [lenis])

  useEffect(() => {
    const stage = sectionRef.current?.querySelector<HTMLElement>('.scroll-video-stage')
    if (!stage || window.matchMedia(reducedMotionQuery).matches) return
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch') return
      const bounds = stage.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width * 2 - 1
      const y = (event.clientY - bounds.top) / bounds.height * 2 - 1
      stage.style.setProperty('--parallax-bg-x', `${-x * 8}px`)
      stage.style.setProperty('--parallax-bg-y', `${-y * 8}px`)
      stage.style.setProperty('--parallax-text-x', `${x * 11}px`)
      stage.style.setProperty('--parallax-text-y', `${y * 8}px`)
      stage.style.setProperty('--parallax-bird-x', `${x * 17}px`)
      stage.style.setProperty('--parallax-bird-y', `${y * 14}px`)
    }
    const resetPointer = () => {
      stage.style.setProperty('--parallax-bg-x', '0px')
      stage.style.setProperty('--parallax-bg-y', '0px')
      stage.style.setProperty('--parallax-text-x', '0px')
      stage.style.setProperty('--parallax-text-y', '0px')
      stage.style.setProperty('--parallax-bird-x', '0px')
      stage.style.setProperty('--parallax-bird-y', '0px')
    }
    stage.addEventListener('pointermove', onPointerMove, { passive: true })
    stage.addEventListener('pointerleave', resetPointer, { passive: true })
    return () => {
      stage.removeEventListener('pointermove', onPointerMove)
      stage.removeEventListener('pointerleave', resetPointer)
    }
  }, [])

  return (
    <section className="scroll-video-sequence" ref={sectionRef} aria-label="A scroll-driven journey through rainforest wildlife">
      <div className="scroll-video-stage">
        <div className="scroll-video-opening" aria-hidden="true">
          <div className="scroll-video-opening-background" />
          <div className="scroll-video-opening-copy">
            <span>RAINFOREST · MACAWS IN FLIGHT</span>
            <h2>WINGS OF<br />THE WILD</h2>
          </div>
          <img className="scroll-video-opening-birds" src="/hero-frames/macaw-pair-cutout.png" alt="" />
        </div>
        <div className="scroll-video-opening scroll-video-opening--monkey" aria-hidden="true">
          <div className="scroll-video-opening-background scroll-video-opening-background--monkey" />
          <div className="scroll-video-opening-copy scroll-video-opening-copy--monkey">
            <span>RAINFOREST · CANOPY LIFE</span>
            <h2>INTO THE<br />CANOPY</h2>
            <p>Every branch is a world of its own.</p>
          </div>
          <img className="scroll-video-opening-monkey" src="/hero-frames/monkey-cutout.png" alt="" />
        </div>
        <div className="scroll-video-opening scroll-video-opening--frog" aria-hidden="true">
          <div className="scroll-video-opening-background scroll-video-opening-background--frog" />
          <div className="scroll-video-opening-copy scroll-video-opening-copy--frog">
            <span>RAINFOREST · STREAM LIFE</span>
            <h2>A WORLD<br />IN MINIATURE</h2>
            <p>In every drop, life finds a way.</p>
          </div>
          <img className="scroll-video-opening-frog" src="/hero-frames/frog-cutout.png" alt="" />
        </div>
        <canvas ref={canvasRef} aria-label="Macaw and rainforest wildlife footage advances and reverses with scrolling" role="img" />
        <div className="scroll-video-reduced" aria-label="Wildlife film sequence stills">
          <figure><img src={sequences[0][0]} alt="Macaws flying over the rainforest" /><figcaption>01 — MACAWS</figcaption></figure>
          <figure><img src={sequences[1][0]} alt="A monkey moving through the rainforest canopy" /><figcaption>02 — FOREST WILDLIFE</figcaption></figure>
          <figure><img src={sequences[1][sequences[1].length - 1]} alt="An orange and black frog resting on a rainforest leaf" /><figcaption>03 — STREAM LIFE</figcaption></figure>
        </div>
        <span className="scroll-video-frame-index" aria-hidden="true">
          <span ref={sequenceIndexRef}>01</span>
          <i />
          <span>02</span>
        </span>
      </div>
      <span className="scroll-video-sequence-description" aria-live="off">Macaws in flight, a layered hanging-monkey rainforest interlude, then the second wildlife film sequence.</span>
    </section>
  )
}
