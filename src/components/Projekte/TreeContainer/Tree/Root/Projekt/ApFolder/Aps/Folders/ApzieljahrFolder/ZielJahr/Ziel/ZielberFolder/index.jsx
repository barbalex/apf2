import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../mobxContext.js'
import { Zielbers } from './Zielbers.jsx'

export const ZielberFolder = memo(
  observer(({ projekt, ap, jahr, menu }) => {
    const store = useContext(MobxContext)

    const url = [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'AP-Ziele',
      jahr,
      menu.id,
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
          n[6] === menu.id,
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'zielberFolder',
      id: `${menu.id}ZielberFolder`,
      tableId: menu.id,
      urlLabel: 'Berichte',
      label: menu.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Zielbers
            projekt={projekt}
            ap={ap}
            jahr={jahr}
            ziel={menu}
          />
        )}
      </>
    )
  }),
)
