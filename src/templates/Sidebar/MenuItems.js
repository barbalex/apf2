import React from 'react'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import styled from '@emotion/styled'

import MenuItem from './MenuItem'

// dont know why but divider is too thick,
// thicker than ListItemButton divider
const StyledDivider = styled(Divider)`
  height: unset !important;
  background: unset !important;
`

const MenuItems = ({ items }) => {
  return (
    <List component="nav">
      <StyledDivider />
      {items.map(({ node }) => (
        <MenuItem node={node} key={node.id} />
      ))}
    </List>
  )
}

export default MenuItems
