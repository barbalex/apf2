import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Tpopfeldkontr } from './Tpopfeldkontr.jsx'
import { List } from './List.jsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Tpopfeldkontr />

  return <List />
}
