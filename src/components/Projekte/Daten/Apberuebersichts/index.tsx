import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.ts'
import { Component as Projekt } from '../Projekt/index.tsx'
import { List } from './List.tsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Projekt />

  return <List />
}
