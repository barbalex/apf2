import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../storeContext.js'
import { ZielberFolder } from './Zielber/index.js'
import { useZielsOfJahrNavData } from '../../../../../../../../../../../../modules/useZielsOfJahrNavData.js'

export const Ziels = memo(
  observer(({ projekt, ap, jahr }) => {
    const store = useContext(StoreContext)

    const { navData, isLoading, error } = useZielsOfJahrNavData({
      projId: projekt.id,
      apId: ap.id,
      jahr,
    })

    return navData.menus.map((menu) => {
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
        nodeType: 'table',
        menuType: 'ziel',
        id: menu.id,
        parentId: ap.id,
        parentTableId: ap.id,
        urlLabel: menu.id,
        label: menu.label,
        url: [
          'Projekte',
          projekt.id,
          'Arten',
          ap.id,
          'AP-Ziele',
          jahr,
          menu.id,
        ],
        hasChildren: true,
      }

      return (
        <div key={menu.id}>
          <Row node={node} />
          {isOpen && (
            <ZielberFolder
              projekt={projekt}
              ap={ap}
              jahr={jahr}
              ziel={menu}
            />
          )}
        </div>
      )
    })
  }),
)
