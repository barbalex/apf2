import { useAtomValue } from 'jotai'

import { isDesktopViewAtom } from '../../../../store/index.ts'
import { Component as Tpopfreiwkontr } from './Tpopfreiwkontr.tsx'
import { List } from './List.tsx'

interface ComponentProps {
  id?: string | undefined
}

export const Component = ({ id }: ComponentProps) => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  if (isDesktopView) return <Tpopfreiwkontr id={id} />

  return <List />
}
