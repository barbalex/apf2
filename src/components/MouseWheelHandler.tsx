import { useEffect } from 'react'

export const MouseWheelHandler = () => {
  // prevent scrolling/mousewheel from changing numbers
  // while not preventing scrolling itself!
  // https://stackoverflow.com/a/20838527/712005
  // passive: false is needed or else chrome will bark
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      console.log('preventing wheel')
      e.preventDefault()
      ;(e.target as HTMLElement).blur()
    }
    const handleFocusNumberInput = (e: FocusEvent) => {
      //console.log('handleFocusNumberInput, e is:', e)
      const target = e.target as HTMLElement
      if (target instanceof HTMLInputElement && target.type === 'number') {
        target.addEventListener('wheel', handleWheel, { passive: false })
      }
    }
    document.addEventListener('focusin', handleFocusNumberInput, {
      passive: false,
    })

    const handleBlurNumberInput = (e: FocusEvent) => {
      //console.log('handleBlurNumberInput, e is:', e)
      const target = e.target as HTMLElement
      if (target instanceof HTMLInputElement && target.type === 'number') {
        target.removeEventListener('wheel', handleWheel)
      }
    }
    document.addEventListener('focusout', handleBlurNumberInput, {
      passive: false,
    })

    return () => {
      document.removeEventListener('focusout', handleBlurNumberInput)
    }
  }, [])

  return null
}
