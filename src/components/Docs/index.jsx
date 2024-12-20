import { memo } from 'react'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../JotaiStore/index.js'
import { List } from './List.jsx'
import { Component as Docs } from './Docs.jsx'

export const Component = memo(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  console.log('Docs.isDesktopView', isDesktopView)

  if (isDesktopView) return <Docs />

  return <List />
})
