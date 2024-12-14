import { memo, useRef, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../mobxContext.js'

export const Tpopmassn = memo(
  observer(({ projekt, ap, pop, tpop, menu, inProp }) => {
    const store = useContext(MobxContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Teil-Populationen' &&
          n[7] === tpop.id &&
          n[8] === 'Massnahmen' &&
          n[9] === menu.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'tpopmassn',
      id: menu.id,
      parentId: tpop.id,
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
        'Massnahmen',
        menu.id,
      ],
      hasChildren: true,
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
          <>
            <Row
              node={node}
              ref={ref}
              transitionState={state}
            />
            {isOpen && <div>open</div>}
          </>
        )}
      </Transition>
    )
  }),
)
