import { useAtomValue } from 'jotai'

import { isDesktopViewAtom } from '../../../../store/index.ts'
import { Component as Tpopmassn } from './Tpopmassn.tsx'
import { List } from './List.tsx'

export const Component = () => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  if (isDesktopView) return <Tpopmassn />

  return <List />
}
