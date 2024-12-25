import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../../../../Row.jsx'
import { Zaehls } from './Zaehls.jsx'
import { useTpopfeldkontrzaehlsNavData } from '../../../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrzaehlsNavData.js'
import { NodesList } from '../../../../../../../../../../../../../../../NodesList/index.jsx'

export const ZaehlFolder = memo(
  ({ projekt, ap, pop, tpop, tpopkontr, menu }) => {
    const { navData } = useTpopfeldkontrzaehlsNavData({
      projId: projekt.id,
      apId: ap.id,
      popId: pop.id,
      tpopId: tpop.id,
      tpopkontrId: tpopkontr.id,
    })

    // Zählungen are always open
    const isOpen = true

    const node = {
      nodeType: menu.treeNodeType,
      menuType: menu.treeMenuType,
      id: menu.treeId,
      tableId: menu.treeTableId,
      parentId: menu.treeParentId,
      parentTableId: menu.treeParentTableId,
      urlLabel: menu.id,
      label: menu.label,
      labelLeftElements: menu.labelLeftElements,
      url: menu.treeUrl,
      hasChildren: menu.hasChildren,
      alwaysOpen: menu.alwaysOpen,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <Zaehls
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
            tpopkontr={tpopkontr}
          />
        )}
      </>
    )
  },
)
