import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.ts'
import { Component as Ap } from '../Ap/index.jsx'
import { List } from './List.tsx'

export const Component = () => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Ap />

  return <List />
}
