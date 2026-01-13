import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { List } from './List.tsx'
import { Component as Ap } from '../Ap/index.tsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Ap />

  return <List />
}
