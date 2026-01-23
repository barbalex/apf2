import { useResizeDetector } from 'react-resize-detector'
import { useAtom } from 'jotai'

import { setDesktopViewAtom } from '../store/index.ts'
import styles from './IsDesktopViewSetter.module.css'

// this sets the isDesktopViewAtom depending on the width of this component,
// in contrast to: window.innerWidth
export const IsDesktopViewSetter = () => {
  const [, setDesktopView] = useAtom(setDesktopViewAtom)

  const onResize = ({ width }) => setDesktopView(width)

  // on first load this provokes:
  // Cannot update a component (`Router`) while rendering a different component (`IsDesktopViewSetter`).
  // To locate the bad setState() call inside `IsDesktopViewSetter`, follow the stack trace as described in https://react.dev/link/setstate-in-render
  const { ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { leading: false, trailing: true },
    onResize,
  })

  return (
    <div
      className={styles.measuringDiv}
      ref={ref}
    />
  )
}
