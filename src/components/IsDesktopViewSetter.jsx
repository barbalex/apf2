import { memo, useCallback } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { setDesktopViewAtom } from '../JotaiStore/index.js'
import { constants } from '../modules/constants.js'

const InvisibleDesktopViewMeasuringDiv = styled.div`
  width: 100%;
  height: 0;
`

// this sets the isDesktopViewAtom depending on the width of this component,
// in contrast to: window.innerWidth
export const IsDesktopViewSetter = memo(() => {
  const [, setDesktopView] = useAtom(setDesktopViewAtom)

  const onResize = useCallback(
    ({ width }) => setDesktopView(width),
    [setDesktopView],
  )

  const { width, ref } = useResizeDetector({
    handleHeight: false,
    refreshMode: 'debounce',
    refreshRate: 300,
    refreshOptions: { leading: false, trailing: true },
    onResize,
  })

  return <InvisibleDesktopViewMeasuringDiv ref={ref} />
})
