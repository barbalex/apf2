import { memo, useRef } from 'react'

import { Row } from '../../../Row.jsx'
import { useApberuebersichtsNavData } from '../../../../../../../modules/useApberuebersichtsNavData.js'
import { Transition } from 'react-transition-group'

export const Apberuebersicht = memo(({ projekt, apberuebersicht, inProp }) => {
  const projId = projekt.id

  const node = {
    nodeType: 'table',
    menuType: 'apberuebersicht',
    id: apberuebersicht.id,
    parentId: projId,
    parentTableId: projId,
    urlLabel: apberuebersicht.label || '(kein Jahr)',
    label: apberuebersicht.label,
    url: ['Projekte', projId, 'AP-Berichte', apberuebersicht.id],
    hasChildren: false,
  }

  const ref = useRef(null)

  return (
    <Transition
      in={inProp}
      timeout={300}
      mountOnEnter
      unmountOnExit
      nodeRef={ref}
    >
      {(state) => (
        <Row
          key={apberuebersicht.id}
          node={node}
          transitionState={state}
          ref={ref}
        />
      )}
    </Transition>
  )
})
