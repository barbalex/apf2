import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// https://stackoverflow.com/a/65008608/712005
export const useOnScreen = (ref: RefObject<HTMLElement>) => {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry?.isIntersecting ?? false),
      { threshold: 0, rootMargin: '120px 0px 120px 0px' },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref])

  return isIntersecting
}
