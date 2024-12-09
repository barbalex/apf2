import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../mobxContext.js'
import { Zielbers } from './Zielbers.jsx'
import { useZielbersNavData } from '../../../../../../../../../../../../../modules/useZielbersNavData.js'

export const ZielberFolder = memo(
  observer(({ projekt, ap, jahr, ziel }) => {
    const store = useContext(MobxContext)

    const { navData } = useZielbersNavData({
      projId: projekt.id,
      apId: ap.id,
      jahr,
      zielId: ziel.id,
    })

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
      id: `${navData?.id}ZielberFolder`,
      tableId: navData?.id,
      parentId: ziel.id,
      parentTableId: ziel.id,
      urlLabel: 'Berichte',
      label: navData?.label,
      url,
      hasChildren: true,
    }

    if (!navData) return null

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Zielbers
            projekt={projekt}
            ap={ap}
            jahr={jahr}
            ziel={ziel}
            menus={navData.menus}
          />
        )}
      </>
    )
  }),
)
