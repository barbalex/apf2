import { Link, useLocation } from 'react-router'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  treeNodeLabelFilterAtom,
  treeSetNodeLabelFilterKeyAtom,
} from '../../../store/index.ts'
import { MenuItems } from './MenuItems.tsx'
import { Filter } from './Filter.tsx'
import { IntoViewScroller } from './IntoViewScroller.tsx'

import styles from './index.module.css'

export const Sidebar = () => {
  const { search } = useLocation()

  const nodeLabelFilter = useAtomValue(treeNodeLabelFilterAtom)
  const setNodeLabelFilterKey = useSetAtom(treeSetNodeLabelFilterKeyAtom)
  const setFilter = (val) =>
    setNodeLabelFilterKey({
      value: val,
      key: 'doc',
    })

  return (
    <div className={styles.menu}>
      <div className={styles.menuTitle}>
        <Link
          to={`/Dokumentation/${search}`}
          className={styles.menuTitleLink}
        >
          Dokumentation
        </Link>
        <Filter
          filter={nodeLabelFilter.doc ?? ''}
          setFilter={setFilter}
        />
      </div>
      <MenuItems />
      <IntoViewScroller />
    </div>
  )
}
