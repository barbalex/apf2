import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import MenuItem from '@mui/material/MenuItem'
import { useLocation, useNavigate } from 'react-router'
import { isEqual } from 'es-toolkit'

import { menuIsInActiveNodePath } from './menuIsInActiveNodePath.ts'
import { MobxContext } from '../../../../mobxContext.js'

export const Item = observer(({ menu, baseUrl, onClose }) => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const store = useContext(MobxContext)
  const activeNodeArray = store.tree.activeNodeArray

  // issue: relative paths are not working!!!???
  const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

  const selected = menuIsInActiveNodePath({
    menuUrl: `${baseUrl}/${menu.id}`
      .split('/')
      .filter((p) => !!p)
      .filter((p) => p !== 'Daten'),
    activeNodeArray,
  })

  const onClick = () => {
    // 1. navigate
    const pathname = `${baseUrl ?? pathnameWithoutLastSlash}/${menu.id}`
    navigate({ pathname, search })
    // 2. sync tree openNodes
    const url = pathname
      .split('/')
      .filter((e) => !!e)
      .slice(1)
    const newOpenNodes = store.tree.openNodes.filter(
      (n) => !isEqual(n.slice(0, url.length), url),
    )
    store.tree.setOpenNodes(newOpenNodes)
    // 3. close menu
    onClose()
  }

  return (
    <MenuItem
      selected={selected}
      onClick={onClick}
    >
      {!!menu.labelLeftElements?.length &&
        menu.labelLeftElements.map((El, index) => <El key={index} />)}
      {menu.label}
      {!!menu.labelRightElements?.length &&
        menu.labelRightElements.map((El, index) => <El key={index} />)}
    </MenuItem>
  )
})
