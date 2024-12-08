import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../storeContext.js'
import { AssozArts } from './AssozArts.jsx'

export const AssozArtFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)

    const url = ['Projekte', projekt.id, 'Arten', ap.id, 'assoziierte-Arten']

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'assoziierte-Arten',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'assozartFolder',
      id: `${ap.id}AssozartFolder`,
      tableId: ap.id,
      urlLabel: 'assoziierte-Arten',
      label: menu.label,
      url,
      hasChildren: menu.count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <AssozArts
            projekt={projekt}
            ap={ap}
          />
        )}
      </>
    )
  }),
)
