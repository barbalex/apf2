import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../Row.jsx'

export const Beobzugeordnet = memo(
  ({ projekt, ap, pop, tpop, menu, inProp }) => {
    const node = {
      nodeType: 'table',
      menuType: 'beobZugeordnet',
      id: menu.id,
      parentId: `${tpop.id}BeobZugeordnetFolder`,
      parentTableId: tpop.id,
      urlLabel: menu.id,
      label: menu.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
        tpop.id,
        'Beobachtungen',
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
  },
)
