import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../../../../Row.jsx'
import { Zaehls } from './Zaehls.jsx'
import { useTpopfeldkontrzaehlsNavData } from '../../../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrzaehlsNavData.js'

export const ZaehlFolder = memo(
  ({ projekt, ap, pop, tpop, tpopkontr, menu, }) => {
    const { navData } = useTpopfeldkontrzaehlsNavData({
      projId: projekt.id,
      apId: ap.id,
      popId: pop.id,
      tpopId: tpop.id,
      tpopkontrId: tpopkontr.id,
    })

    const url = [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'Populationen',
      pop.id,
      'Teil-Populationen',
      tpop.id,
      'Feld-Kontrollen',
      tpopkontr.id,
      'Zaehlungen',
    ]

    // Zählungen are always open
    const isOpen = true

    const node = {
      nodeType: 'folder',
      menuType: 'tpopfeldkontrzaehlFolder',
      id: `${tpopkontr.id}TpopfeldkontrzaehlFolder`,
      tableId: tpopkontr.id,
      urlLabel: 'Zaehlungen',
      label: navData.label,
      url,
      hasChildren: true,
      alwaysOpen: true,
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
