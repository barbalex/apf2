import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../Row.jsx'

export const EkAbrechnungstyp = memo(({ inProp, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'ekAbrechnungstypWerte',
    id: menu.id,
    parentId: 'ekAbrechnungstypWerteFolder',
    urlLabel: menu.id,
    label: menu.label,
    url: ['Werte-Listen', 'EkAbrechnungstypWerte', menu.id],
    hasChildren: false,
  }

  const ref = useRef(null)

  return <Row node={node} />
})
