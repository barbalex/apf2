import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../storeContext.js'
import { Ziel } from './Ziel/index.jsx'

export const ZielJahr = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(StoreContext)

    const { id, label, jahr } = menu

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr,
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'zieljahrFolder',
      id: `${ap.id}Ziele${jahr ?? 'keinJahr'}`,
      jahr,
      parentId: ap.id,
      urlLabel: `${jahr ?? 'kein Jahr'}`,
      label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele', jahr],
      hasChildren: true,
    }

    return (
      <div key={`${ap.id}/${jahr}`}>
        <Row node={node} />
        {isOpen && (
          <Ziel
            projekt={projekt}
            ap={ap}
            jahr={jahr}
          />
        )}
      </div>
    )
  }),
)
