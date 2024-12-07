import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../Row.jsx'
import { useTpopApberrelevantGrundWertesNavData } from '../../../../../../../modules/useTpopApberrelevantGrundWertesNavData.js'

export const ApberrelevantGrunds = memo(({ in: inProp }) => {
  const { navData } = useTpopApberrelevantGrundWertesNavData()

  const nodes = (navData?.menus).map((el) => ({
    nodeType: 'table',
    menuType: 'tpopApberrelevantGrundWerte',
    id: el.id,
    parentId: 'tpopApberrelevantGrundWerteFolder',
    urlLabel: el.id,
    label: el.label,
    url: ['Werte-Listen', 'ApberrelevantGrundWerte', el.id],
    hasChildren: false,
  }))

  if (!nodes.length) return null

  return nodes.map((node) => (
    <Row
      key={node.id}
      node={node}
    />
  ))
})
