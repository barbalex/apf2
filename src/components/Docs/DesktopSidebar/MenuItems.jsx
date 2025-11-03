import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'

import { MenuItem } from './MenuItem.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { menus } from '../menus.js'

import { divider } from './MenuItems.module.css'

export const MenuItems = observer(() => {
  const store = useContext(MobxContext)
  const nodesFiltered = menus.filter(
    (node) =>
      node.label?.toLowerCase?.()?.includes?.(store.tree.nodeLabelFilter.doc) ??
      true,
  )

  return (
    <List component="nav">
      <Divider className={divider} />
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
