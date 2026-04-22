import { useEffect } from 'react'
import { useSetAtom } from 'jotai'

import { setDesktopViewAtom } from '../store/index.ts'

// this sets the isDesktopViewAtom depending on window width
export const IsDesktopViewSetter = () => {
  const setDesktopView = useSetAtom(setDesktopViewAtom)

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null

    const update = () => setDesktopView(window.innerWidth)

    update()

    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(update, 200)
    }

    window.addEventListener('resize', onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      if (resizeTimeout) clearTimeout(resizeTimeout)
    }
  }, [setDesktopView])

  return null
}
