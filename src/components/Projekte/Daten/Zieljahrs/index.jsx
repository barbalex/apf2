import { memo } from 'react'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Ap } from '../Ap/index.jsx'
import { List } from './List.jsx'

export const Component = memo(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Ap />

  return (
    <List
      items={navData.menus}
      title={navData.label}
      menuBar={<Menu />}
      highlightSearchString={nodeLabelFilter.ziel}
    />
  )
})
