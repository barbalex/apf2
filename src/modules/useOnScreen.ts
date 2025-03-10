import { useEffect, useMemo, useState, RefObject } from 'react'
// https://stackoverflow.com/a/65008608/712005
export const useOnScreen = (ref: RefObject<HTMLElement>) => {
  const [isIntersecting, setIntersecting] = useState(false)

  const observer = useMemo(
    () =>
      new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting),
        { threshold: 0, rootMargin: '120px 0px 120px 0px' },
      ),
    [ref],
  )

  useEffect(() => {
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return isIntersecting
}
