import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../storeContext.js'
import { Zielber } from './Zielber.jsx'
import { useZielbersNavData } from '../../../../../../../../../../../../../modules/useZielbersNavData.js'

export const ZielberFolder = memo(
  observer(({ projekt, ap, jahr, ziel }) => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter } = store.tree

    const { navData, isLoading } = useZielbersNavData()

    const url = [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'AP-Ziele',
      jahr,
      ziel.id,
      'Berichte',
    ]

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 7 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr &&
          n[6] === ziel.id,
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'zielberFolder',
      id: `${ziel.id}ZielberFolder`,
      tableId: ziel.id,
      urlLabel: 'Berichte',
      label: navData.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Zielber
            menus={navData.menus}
            projekt={projekt}
            ap={ap}
            jahr={jahr}
            ziel={ziel}
          />
        )}
      </>
    )
  }),
)
