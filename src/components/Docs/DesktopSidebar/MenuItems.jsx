import { useContext } from 'react'
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

export const MenuItems = () => {
  const { dokuFilter } = useContext(MobxContext)
  const nodesFiltered = menus.filter(
    (node) => node.title?.toLowerCase?.()?.includes?.(dokuFilter) ?? true,
  )

  return (
    <List component="nav">
      <StyledDivider />
      {nodesFiltered.map((node) => (
        <MenuItem
          node={node}
          key={node?.id}
        />
      ))}
    </List>
  )
}
