import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../mobxContext.js'
import { ZielberFolder } from './ZielberFolder/index.jsx'

export const Ziel = memo(
  observer(({ projekt, ap, jahr, menu }) => {
    const store = useContext(MobxContext)

    const node = {
      nodeType: 'table',
      menuType: 'ziel',
      id: menu.id,
      parentId: ap.id,
      parentTableId: ap.id,
      urlLabel: menu.id,
      label: menu.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele', jahr, menu.id],
      hasChildren: true,
    }

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

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <ZielberFolder
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
