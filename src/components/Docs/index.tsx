import { useAtomValue } from 'jotai'

import { isDesktopViewAtom } from '../../store/index.ts'
import { MobileList } from './MobileList.tsx'
import { DesktopDocs } from './DesktopDocs.tsx'

export const Component = () => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  if (isDesktopView) return <DesktopDocs />

  return <MobileList />
}
