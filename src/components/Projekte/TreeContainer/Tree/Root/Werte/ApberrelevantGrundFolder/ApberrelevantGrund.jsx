import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../Row.jsx'

export const ApberrelevantGrund = memo(({ inProp, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'tpopApberrelevantGrundWerte',
    id: menu.id,
    parentId: 'tpopApberrelevantGrundWerteFolder',
    urlLabel: menu.id,
    label: menu.label,
    url: ['Werte-Listen', 'ApberrelevantGrundWerte', menu.id],
    hasChildren: false,
  }

  const ref = useRef(null)

  return <Row node={node} />
})
