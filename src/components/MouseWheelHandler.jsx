import { useEffect } from 'react'

const MouseWheelHandler = () => {
  // prevent scrolling/mousewheel from changing numbers
  // while not preventing scrolling itself!
  // https://stackoverflow.com/a/20838527/712005
  // passive: false is needed or else chrome will bark
  useEffect(() => {
    const handleWheel = (e) => {
      console.log('preventing wheel')
      e.preventDefault()
      e.target.blur()
    }
    const handleFocusNumberInput = (e) => {
      //console.log('handleFocusNumberInput, e is:', e)
      if (e.target.type === 'number') {
        e.target.addEventListener('wheel', handleWheel, { passive: false })
      }
    }
    document.addEventListener('focusin', handleFocusNumberInput, {
      passive: false,
    })

    const handleBlurNumberInput = (e) => {
      //console.log('handleBlurNumberInput, e is:', e)
      if (e.target.type === 'number') {
        e.target.removeEventListener('wheel', handleWheel, { passive: false })
      }
    }
    document.addEventListener('focusout', handleBlurNumberInput, {
      passive: false,
    })

    return () => {
      document.removeEventListener('focusout', handleBlurNumberInput, {
        passive: false,
      })
    }
  }, [])

  return null
}

export default MouseWheelHandler
