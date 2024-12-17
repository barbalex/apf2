import { memo, useRef, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'

import { MobxContext } from '../../../../../../../../../../../../../../mobxContext.js'
import { Row } from '../../../../../../../../../../Row.jsx'
import { TpopFolders } from './Folders/index.jsx'

export const Tpop = memo(
  observer(({ projekt, ap, pop, menu, inProp }) => {
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
          n[7] === menu.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'tpop',
      singleElementName: 'Teil-Population',
      id: menu.id,
      parentId: `${pop.id}TpopFolder`,
      parentTableId: pop.id,
      urlLabel: menu.id,
      label: menu.label,
      labelLeftElements: menu.labelLeftElements,
      status: menu.status,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
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
            <TransitionGroup component={null}>
              {isOpen && (
                <TpopFolders
                  projekt={projekt}
                  ap={ap}
                  pop={pop}
                  tpop={menu}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
