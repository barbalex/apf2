import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Tpopmassn } from './Tpopmassn.tsx'
import { List } from './List.tsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Tpopmassn />

  return <List />
}
