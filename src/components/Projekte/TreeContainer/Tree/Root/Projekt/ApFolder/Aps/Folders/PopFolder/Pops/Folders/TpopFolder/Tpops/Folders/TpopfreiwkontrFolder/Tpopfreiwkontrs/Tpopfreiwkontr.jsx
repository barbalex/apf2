import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { ZaehlFolder } from './Zaehl/index.jsx'

export const Tpopfreiwkontr = memo(
  observer(({ projekt, ap, pop, tpop, menu, inProp }) => {
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
          n[8] === 'Freiwilligen-Kontrollen' &&
          n[9] === menu.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'tpopfreiwkontr',
      id: menu.id,
      tableId: menu.id,
      parentId: `${tpop.id}TpopfreiwkontrFolder`,
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
        'Freiwilligen-Kontrollen',
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
            {isOpen && (
              <ZaehlFolder
                projekt={projekt}
                ap={ap}
                pop={pop}
                tpop={tpop}
                tpopkontr={menu}
              />
            )}
          </>
        )}
      </Transition>
    )
  }),
)
