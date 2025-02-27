import { memo } from 'react'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../JotaiStore/index.js'
import { MobileList } from './MobileList.jsx'
import { DesktopDocs } from './DesktopDocs.jsx'

export const Component = memo(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <DesktopDocs />

  return <MobileList />
})
