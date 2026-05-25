import { useEffect, useRef, useState } from 'react'

function CountUp({ value, duration = 2000 }) {
  const ref = useRef(null)
  const [display, setDisplay] = useState('0')
  const hasAnimated = useRef(false)
  const rafId = useRef(null)

  const match = String(value).match(/^(\d+)(.*)$/)
  const target = match ? parseInt(match[1], 10) : 0
  const suffix = match ? match[2] : ''

  function animate() {
    const start = performance.now()

    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

      const current = Math.round(eased * target)
      setDisplay(`${current}${suffix}`)

      if (progress < 1) {
        rafId.current = requestAnimationFrame(tick)
      }
    }

    rafId.current = requestAnimationFrame(tick)
  }

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
    return () => {
      observer.disconnect()
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <span ref={ref}>{display}</span>
}

export default CountUp
