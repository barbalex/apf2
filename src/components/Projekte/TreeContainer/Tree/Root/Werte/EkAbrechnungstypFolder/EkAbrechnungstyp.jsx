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
