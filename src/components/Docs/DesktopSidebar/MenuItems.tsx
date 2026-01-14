import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { toJS } from 'mobx'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'

import { MenuItem } from './MenuItem.tsx'
import { MobxContext } from '../../../mobxContext.ts'
import { menus } from '../menus.ts'

import styles from './MenuItems.module.css'

export const MenuItems = observer(() => {
  const store = useContext(MobxContext)
  const nodesFiltered = menus.filter((node) => {
    if (!store.tree.nodeLabelFilter.doc) return true
    return (
      node.label?.toLowerCase?.()?.includes?.(store.tree.nodeLabelFilter.doc) ??
      true
    )
  })

  return (
    <List component="nav">
      <Divider className={styles.divider} />
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
