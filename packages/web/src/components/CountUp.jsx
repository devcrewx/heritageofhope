import { useEffect, useRef, useState } from 'react'

/**
 * Animates a number from 0 to a target value when scrolled into view.
 * Handles values like "200+", "15+", "3+" — parses the numeric part
 * and preserves any suffix.
 */
function CountUp({ value, duration = 2000 }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState('0')
  const hasAnimated = useRef(false)

  // Parse "200+" → { target: 200, suffix: "+" }
  const match = String(value).match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          animate()
          observer.unobserve(element)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(element)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function animate() {
    const start = performance.now()

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      // easeOutExpo — fast start, smooth deceleration
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      const current = Math.round(eased * target)
      setDisplay(`${current}${suffix}`)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }

  return <span ref={ref}>{display}</span>
}

export default CountUp
