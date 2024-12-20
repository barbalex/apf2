import { memo, useCallback, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import MenuItem from '@mui/material/MenuItem'
import { useLocation, useNavigate } from 'react-router'
import isEqual from 'lodash/isEqual'

import { menuIsInActiveNodePath } from './menuIsInActiveNodePath.js'
import { MobxContext } from '../../../../mobxContext.js'

export const Item = memo(
  observer(({ menu, baseUrl, onClose }) => {
    const { pathname, search } = useLocation()
    const navigate = useNavigate()

    const store = useContext(MobxContext)
    const activeNodeArray = store.tree.activeNodeArray

    // issue: relative paths are not working!!!???
    const pathnameWithoutLastSlash = pathname.replace(/\/$/, '')

    const selected = useMemo(
      () =>
        menuIsInActiveNodePath({
          menuUrl: `${baseUrl}/${menu.id}`
            .split('/')
            .filter((p) => !!p)
            .filter((p) => p !== 'Daten'),
          activeNodeArray,
        }),
      [activeNodeArray, baseUrl, menu.id],
    )
    const onClick = useCallback(() => {
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
    }, [navigate, onClose, baseUrl, pathnameWithoutLastSlash, menu.id, search])

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
  }),
)
