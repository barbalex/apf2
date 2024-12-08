import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../mobxContext.js'
import { ApErfkrit } from './Aperfkrits.jsx'

export const AperfkritFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)

    const url = ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Erfolgskriterien']

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Erfolgskriterien',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'erfkritFolder',
      id: `${ap.id}ErfkritFolder`,
      tableId: ap.id,
      urlLabel: 'AP-Erfolgskriterien',
      label: menu.label,
      url,
      hasChildren: menu.count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <ApErfkrit
            projekt={projekt}
            ap={ap}
          />
        )}
      </>
    )
  }),
)
