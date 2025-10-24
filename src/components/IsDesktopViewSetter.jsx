import { useResizeDetector } from 'react-resize-detector'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { setDesktopViewAtom } from '../JotaiStore/index.js'

const InvisibleDesktopViewMeasuringDiv = styled.div`
  width: 100%;
  height: 0;
`

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

  return <InvisibleDesktopViewMeasuringDiv ref={ref} />
}
