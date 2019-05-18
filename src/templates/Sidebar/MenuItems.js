import React from 'react'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'

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
