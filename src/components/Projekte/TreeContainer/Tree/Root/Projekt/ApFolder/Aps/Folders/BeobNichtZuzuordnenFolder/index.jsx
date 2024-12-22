import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../mobxContext.js'
import { BeobNichtZuzuordnens } from './BeobNichtZuzuordnens.jsx'

export const BeobNichtZuzuordnenFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)

    const isOpen = store.tree.openNodes.some((n) =>
      isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
    )

    const node = {
      nodeType: menu.treeNodeType,
      menuType: menu.treeMenuType,
      id: menu.treeId,
      tableId: menu.treeTableId,
      urlLabel: menu.id,
      label: menu.label,
      url: menu.treeUrl,
      hasChildren: menu.hasChildren,
      labelLeftElements: menu.labelLeftElements,
    }

    console.log('FetcherName', menu.fetcherName)

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <BeobNichtZuzuordnens
              projekt={projekt}
              ap={ap}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
