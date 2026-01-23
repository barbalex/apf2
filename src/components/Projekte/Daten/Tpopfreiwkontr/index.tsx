import { useAtomValue } from 'jotai'

import { isDesktopViewAtom } from '../../../../store/index.ts'
import { Component as Tpopfreiwkontr } from './Tpopfreiwkontr.tsx'
import { List } from './List.tsx'

import type { TpopkontrId } from '../../../../models/apflora/TpopkontrId.ts'

interface ComponentProps {
  id?: TpopkontrId
}

export const Component = ({ id }: ComponentProps) => {
  const isDesktopView = useAtomValue(isDesktopViewAtom)

  if (isDesktopView) return <Tpopfreiwkontr id={id} />

  return <List />
}
