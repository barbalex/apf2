import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../mobxContext.js'
import { Zieljahrs } from './Zieljahrs.jsx'

export const ApzieljahrFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(MobxContext)
    const { openNodes } = store.tree

    const url = ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele']

    const isOpen =
      openNodes.filter(
        (n) =>
          n.length > 4 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'zielFolder',
      id: `${ap.id}ApzielFolder`,
      tableId: ap.id,
      urlLabel: 'AP-Ziele',
      label: navData.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Zieljahrs
            projekt={projekt}
            ap={ap}
          />
        )}
      </>
    )
  }),
)
