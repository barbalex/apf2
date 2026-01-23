import { useAtomValue } from 'jotai'

import { isDesktopViewAtom } from '../../../../store/index.ts'
import { Component as Tpopfeldkontr } from './Tpopfeldkontr.tsx'
import { List } from './List.tsx'

export const Component = () => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  if (isDesktopView) return <Tpopfeldkontr />

  return <List />
}
