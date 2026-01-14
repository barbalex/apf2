import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../JotaiStore/index.ts'
import { MobileList } from './MobileList.tsx'
import { DesktopDocs } from './DesktopDocs.tsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <DesktopDocs />

  return <MobileList />
}
