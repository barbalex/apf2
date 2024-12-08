import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../Row.jsx'

export const Aperfkrit = memo(({ projekt, ap, inProp, menu }) => {
  const node = {
    nodeType: 'table',
    menuType: 'erfkrit',
    id: menu.id,
    parentId: ap.id,
    parentTableId: ap.id,
    urlLabel: menu.id,
    label: menu.label,
    url: [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'AP-Erfolgskriterien',
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
