import { memo } from 'react'
import { useAtom } from 'jotai'

import { isDesktopViewAtom } from '../../../../JotaiStore/index.js'
import { List } from './List.jsx'
import { Component as Ap } from '../Ap/index.jsx'

export const Component = memo(() => {
  const [isDesktopView] = useAtom(isDesktopViewAtom)

  if (isDesktopView) return <Ap />

  return <List />
})
