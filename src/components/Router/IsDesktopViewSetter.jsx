import { memo, useCallback } from 'react'
import { useResizeDetector } from 'react-resize-detector'
import { useAtom } from 'jotai'
import styled from '@emotion/styled'

import { isDesktopViewAtom } from '../../JotaiStore/index.js'
import { constants } from '../../modules/constants.js'

const InvisibleDesktopViewMeasuringDiv = styled.div`
  width: 100vw;
  height: 0;
`

export const IsDesktopViewSetter = memo(() => {
  const [isDesktopView, setIsDesktopView] = useAtom(isDesktopViewAtom)

  const onResize = useCallback(
    ({ width }) => {
      const isNowDesktopView = width >= constants.mobileViewMaxWidth
      if (isNowDesktopView === isDesktopView) return
      setIsDesktopView(isNowDesktopView)
    },
    [isDesktopView, setIsDesktopView],
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
