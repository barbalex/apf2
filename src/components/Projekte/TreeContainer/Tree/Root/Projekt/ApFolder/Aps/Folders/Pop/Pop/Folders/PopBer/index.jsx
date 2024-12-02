import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../storeContext.js'
import { PopBer } from './PopBer.jsx'

export const PopBerFolder = memo(
  observer(({ projekt, ap, pop, menu }) => {
    const store = useContext(StoreContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Kontroll-Berichte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'popberFolder',
      id: `${pop.id}PopberFolder`,
      tableId: pop.id,
      urlLabel: 'Kontroll-Berichte',
      label: menu.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Kontroll-Berichte',
      ],
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <PopBer
            projekt={projekt}
            ap={ap}
            pop={pop}
          />
        )}
      </>
    )
  }),
)
