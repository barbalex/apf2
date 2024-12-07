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
          node={node}
          transitionState={state}
          ref={ref}
        />
      )}
    </Transition>
  )
})
