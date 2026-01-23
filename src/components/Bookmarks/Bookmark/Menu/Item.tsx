import MenuItem from '@mui/material/MenuItem'
import { useLocation, useNavigate } from 'react-router'
import { isEqual } from 'es-toolkit'
import { useAtomValue, useSetAtom } from 'jotai'

import { menuIsInActiveNodePath } from './menuIsInActiveNodePath.ts'
import {
  treeActiveNodeArrayAtom,
  treeOpenNodesAtom,
  treeSetOpenNodesAtom,
} from '../../../../store/index.ts'

export const Item = ({ menu, baseUrl, onClose }) => {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()

  const activeNodeArray = useAtomValue(treeActiveNodeArrayAtom)
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const setOpenNodes = useSetAtom(treeSetOpenNodesAtom)

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
    const newOpenNodes = openNodes.filter(
      (n) => !isEqual(n.slice(0, url.length), url),
    )
    setOpenNodes(newOpenNodes)
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
}
