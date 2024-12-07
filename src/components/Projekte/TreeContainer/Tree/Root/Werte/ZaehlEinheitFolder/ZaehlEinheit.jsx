import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../Row.jsx'
import { useTpopkontrzaehlEinheitWertesNavData } from '../../../../../../../modules/useTpopkontrzaehlEinheitWertesNavData.js'

export const ZaehlEinheit = memo(({ inProp, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'tpopkontrzaehlEinheitWerte',
    id: menu.id,
    parentId: 'tpopkontrzaehlEinheitWerteFolder',
    urlLabel: menu.id,
    label: menu.label,
    url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', menu.id],
    hasChildren: false,
  }

  const ref = useRef(null)

  return <Row node={node} />
})
