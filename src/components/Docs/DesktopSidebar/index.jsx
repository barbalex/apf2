import { useContext } from 'react'
import { Link, useLocation } from 'react-router'
import { observer } from 'mobx-react-lite'

import { MobxContext } from '../../../mobxContext.js'
import { MenuItems } from './MenuItems.jsx'
import { Filter } from './Filter.jsx'
import { IntoViewScroller } from './IntoViewScroller.jsx'

import { menu, menuTitle, menuTitleLink } from './index.module.css'

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
    <div className={menu}>
      <div className={menuTitle}>
        <Link
          to={`/Dokumentation/${search}`}
          className={menuTitleLink}
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
