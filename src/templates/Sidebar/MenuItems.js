import React from 'react'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'

import MenuItem from './MenuItem'

const MenuItems = ({ items }) => {
  return (
    <List component="nav">
      <Divider />
      {items.map(({ node }) => (
        <MenuItem node={node} key={node.id} />
      ))}
    </List>
  )
}

export default MenuItems
