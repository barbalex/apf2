import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../mobxContext.js'
import { Aparts } from './Aparts.jsx'

export const ApArtFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Taxa',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'apartFolder',
      id: `${ap.id}ApartFolder`,
      tableId: ap.id,
      urlLabel: 'Taxa',
      label: menu.label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'Taxa'],
      hasChildren: menu.count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Aparts
            projekt={projekt}
            ap={ap}
          />
        )}
      </>
    )
  }),
)
