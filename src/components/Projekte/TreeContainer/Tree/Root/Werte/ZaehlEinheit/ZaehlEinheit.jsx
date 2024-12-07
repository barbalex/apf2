import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../Row.jsx'
import { useTpopkontrzaehlEinheitWertesNavData } from '../../../../../../../modules/useTpopkontrzaehlEinheitWertesNavData.js'

export const ZaehlEinheit = memo(({ in: inProp }) => {
  const { navData } = useTpopkontrzaehlEinheitWertesNavData()

  return navData.menus.map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'tpopkontrzaehlEinheitWerte',
      id: el.id,
      parentId: 'tpopkontrzaehlEinheitWerteFolder',
      urlLabel: el.id,
      label: el.label,
      url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', el.id],
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
