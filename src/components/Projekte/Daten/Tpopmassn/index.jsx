import { memo } from 'react'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { Component as Tpopmassn } from './Tpopmassn.jsx'
import { List } from './List.jsx'

export const Component = memo(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Tpopmassn />

  return <List />
})
