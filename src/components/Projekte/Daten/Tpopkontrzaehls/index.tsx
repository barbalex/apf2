import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Tpopkontr } from '../Tpopfeldkontr/index.tsx'
import { List } from './List.tsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Tpopkontr />

  return <List />
}
