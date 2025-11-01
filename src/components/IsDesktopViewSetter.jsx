import { useResizeDetector } from 'react-resize-detector'
import { useAtom } from 'jotai'

import { setDesktopViewAtom } from '../JotaiStore/index.js'
import { measuringDiv } from './IsDesktopViewSetter.module.css'

// this sets the isDesktopViewAtom depending on the width of this component,
// in contrast to: window.innerWidth
export const IsDesktopViewSetter = () => {
  const [, setDesktopView] = useAtom(setDesktopViewAtom)

  const onResize = ({ width }) => setDesktopView(width)

  const { ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { leading: false, trailing: true },
    onResize,
  })

  return (
    <div
      className={measuringDiv}
      ref={ref}
    />
  )
}
