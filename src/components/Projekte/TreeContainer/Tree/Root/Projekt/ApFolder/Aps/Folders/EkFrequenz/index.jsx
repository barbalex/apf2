import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { EkFrequenz } from './EkFrequenz.jsx'

export const EkFrequenzFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(StoreContext)

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
        {isOpen && (
          <EkFrequenz
            projekt={projekt}
            ap={ap}
          />
        )}
      </>
    )
  }),
)
