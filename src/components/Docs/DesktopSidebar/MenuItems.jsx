import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import styled from '@emotion/styled'

import { MenuItem } from './MenuItem.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { menus } from '../menus.js'

// don't know why but divider is too thick,
// thicker than ListItemButton divider
const StyledDivider = styled(Divider)`
  height: unset !important;
  background: unset !important;
`

export const MenuItems = observer(() => {
  const store = useContext(MobxContext)
  const nodesFiltered = menus.filter(
    (node) =>
      node.label?.toLowerCase?.()?.includes?.(store.tree.nodeLabelFilter.doc) ??
      true,
  )

  return (
    <List component="nav">
      <StyledDivider />
      {nodesFiltered.map((node) => (
        <MenuItem
          key={node?.id}
          node={node}
          highlightSearchString={store.tree.nodeLabelFilter.doc}
        />
      ))}
    </List>
  )
})
