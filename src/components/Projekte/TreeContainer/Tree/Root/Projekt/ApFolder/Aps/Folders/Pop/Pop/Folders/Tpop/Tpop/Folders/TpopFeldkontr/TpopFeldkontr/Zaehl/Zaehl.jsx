import { memo } from 'react'

import { Row } from '../../../../../../../../../../../../../../Row.jsx'
import { useTpopfeldkontrzaehlsNavData } from '../../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrzaehlsNavData.js'

export const Zaehl = memo(({ projekt, ap, pop, tpop, tpopkontr }) => {
  const { navData } = useTpopfeldkontrzaehlsNavData({
    projId: projekt.id,
    apId: ap.id,
    popId: pop.id,
    tpopId: tpop.id,
    tpopkontrId: tpopkontr.id,
  })

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopfeldkontrzaehl',
      id: el.id,
      parentId: `${tpopkontr.id}TpopfeldkontrzaehlFolder`,
      parentTableId: tpopkontr.id,
      urlLabel: el.id,
      label: el.label,
      url: [
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
        el.id,
      ],
      hasChildren: false,
    }

    return (
      <Row
        key={el.id}
        node={node}
      />
    )
  })
})
