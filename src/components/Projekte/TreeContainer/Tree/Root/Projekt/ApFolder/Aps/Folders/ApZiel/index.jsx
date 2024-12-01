import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { ZielJahre } from './ZielJahre/index.jsx'
import { useZieljahrsNavData } from '../../../../../../../../../../modules/useZieljahrsNavData.js'

export const ApZielFolder = memo(
  observer(({ projekt, ap, menu }) => {
    const store = useContext(StoreContext)
    const { openNodes } = store.tree

    const { navData, isLoading } = useZieljahrsNavData({
      projId: projekt.id,
      apId: ap.id,
    })

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
      hasChildren: navData.menus.count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <ZielJahre
            projekt={projekt}
            ap={ap}
            menus={navData.menus}
          />
        )}
      </>
    )
  }),
)
