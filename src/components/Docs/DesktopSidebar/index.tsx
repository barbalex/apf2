import { useContext } from 'react'
import { Link, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.ts'
import { MenuItems } from './MenuItems.tsx'
import { Filter } from './Filter.tsx'
import { IntoViewScroller } from './IntoViewScroller.tsx'

import styles from './index.module.css'

export const Sidebar = observer(() => {
  const { search } = useLocation()

  const store = useContext(MobxContext)
  const { setKey: setNodeLabelFilterKey } = store.tree.nodeLabelFilter
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
          filter={store.tree.nodeLabelFilter.doc ?? ''}
          setFilter={setFilter}
        />
      </div>
      <MenuItems />
      <IntoViewScroller />
    </div>
  )
})
