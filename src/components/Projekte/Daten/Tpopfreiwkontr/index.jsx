import { memo } from 'react'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Tpopfreiwkontr } from './Tpopfreiwkontr.jsx'
import { List } from './List.jsx'

export const Component = memo(({ id }) => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Tpopfreiwkontr id={id} />

  return <List />
})
