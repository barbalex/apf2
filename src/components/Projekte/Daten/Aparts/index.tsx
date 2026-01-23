import { useAtomValue } from 'jotai'

import { isDesktopViewAtom } from '../../../../store/index.ts'
import { Component as Ap } from '../Ap/index.tsx'
import { List } from './List.tsx'

export const Component = () => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  if (isDesktopView) return <Ap />

  return <List />
}
