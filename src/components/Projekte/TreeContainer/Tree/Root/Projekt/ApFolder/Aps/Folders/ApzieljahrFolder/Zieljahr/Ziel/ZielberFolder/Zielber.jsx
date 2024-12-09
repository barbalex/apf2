import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../../../../Row.jsx'

export const Zielber = memo(({ projekt, ap, jahr, ziel, menu, inProp }) => {
  const node = {
    nodeType: 'table',
    menuType: 'zielber',
    id: menu.id,
    parentId: ziel.id,
    parentTableId: ziel.id,
    urlLabel: menu.id,
    label: menu.label,
    url: [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'AP-Ziele',
      jahr,
      ziel.id,
      'Berichte',
      menu.id,
    ],
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
          ref={ref}
          transitionState={state}
        />
      )}
    </Transition>
  )
})
