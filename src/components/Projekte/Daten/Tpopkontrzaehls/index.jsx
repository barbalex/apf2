import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Tpopkontr } from '../Tpopfeldkontr/index.jsx'
import { List } from './List.jsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Tpopkontr />

  return <List />
}
