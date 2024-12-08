import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../storeContext.js'
import { Ekfrequenzs } from './Ekfrequenzs.jsx'

export const EkfrequenzFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)

    const url = ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Frequenzen']

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'EK-Frequenzen',
      ).length > 0

    const tableId = ap.id
    const urlLabel = 'EK-Frequenzen'
    const node = {
      nodeType: 'folder',
      menuType: 'ekfrequenzFolder',
      id: `${tableId}/${urlLabel}`,
      tableId,
      urlLabel,
      label: menu.label,
      url,
      hasChildren: menu.count > 0,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Ekfrequenzs
              projekt={projekt}
              ap={ap}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
