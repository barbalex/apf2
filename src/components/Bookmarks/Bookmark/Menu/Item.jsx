import { memo, useCallback, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import MenuItem from '@mui/material/MenuItem'
import { useLocation, useNavigate } from 'react-router'
import styled from '@emotion/styled'

import { menuIsInActiveNodePath } from './menuIsInActiveNodePath.js'
import { MobxContext } from '../../../../mobxContext.js'
import { toggleNodeSymbol } from '../../../Projekte/TreeContainer/Tree/toggleNodeSymbol.js'

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
      const pathname = `${baseUrl ?? pathnameWithoutLastSlash}/${menu.id}`
      console.log('Item onClick', { menu, baseUrl, pathname })
      navigate({ pathname, search })
      // 2. sync tree openNodes
      toggleNodeSymbol({
        node: {
          url: pathname
            .split('/')
            .filter((e) => !!e)
            .slice(1),
        },
        store,
        search,
        navigate,
        doNotSwitchToNodesParent: true,
      })
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
