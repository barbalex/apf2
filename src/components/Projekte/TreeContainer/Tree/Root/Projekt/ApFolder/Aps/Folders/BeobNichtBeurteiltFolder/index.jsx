import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../storeContext.js'
import { BeobNichtBeurteilts } from './BeobNichtBeurteilts.jsx'

export const BeobNichtBeurteiltFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)

    const url = [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'nicht-beurteilte-Beobachtungen',
    ]

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'nicht-beurteilte-Beobachtungen',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'beobNichtBeurteiltFolder',
      id: `${ap.id}BeobNichtBeurteiltFolder`,
      tableId: ap.id,
      urlLabel: 'nicht-beurteilte-Beobachtungen',
      label: menu.label,
      url,
      hasChildren: menu.count > 0,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <BeobNichtBeurteilts
              projekt={projekt}
              ap={ap}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
