import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import { useAtomValue } from 'jotai'

import { MenuItem } from './MenuItem.tsx'
import { treeNodeLabelFilterAtom } from '../../../JotaiStore/index.ts'
import { menus } from '../menus.ts'

import styles from './MenuItems.module.css'

export const MenuItems = () => {
  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const nodesFiltered = menus.filter((node) => {
    if (!nodeLabelFilter.doc) return true
    return node.label?.toLowerCase?.()?.includes?.(nodeLabelFilter.doc) ?? true
  })

  return (
    <List component="nav">
      <Divider className={styles.divider} />
      {nodesFiltered.map((node) => (
        <MenuItem
          key={node?.id}
          node={node}
          highlightSearchString={nodeLabelFilter.doc}
        />
      ))}
    </List>
  )
}
