import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../JotaiStore/index.js'
import { MobileList } from './MobileList.jsx'
import { DesktopDocs } from './DesktopDocs.jsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <DesktopDocs />

  return <MobileList />
}
