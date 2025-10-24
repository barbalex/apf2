import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Idealbiotop } from './Idealbiotop.jsx'
import { List } from './List.jsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Idealbiotop />

  return <List />
}
