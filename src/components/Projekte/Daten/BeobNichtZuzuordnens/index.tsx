import { useAtomValue } from 'jotai'

import { isDesktopViewAtom } from '../../../../store/index.ts'
import { List } from './List.tsx'
import { Component as Ap } from '../Ap/index.tsx'

export const Component = () => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  if (isDesktopView) return <Ap />

  return <List />
}
