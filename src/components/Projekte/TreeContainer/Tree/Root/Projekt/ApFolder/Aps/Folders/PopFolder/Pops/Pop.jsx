import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../mobxContext.js'
import { PopFolders } from './Folders/index.jsx'

export const Pop = memo(
  observer(({ projekt, ap, menu, inProp }) => {
    const store = useContext(MobxContext)

    const node = {
      nodeType: 'table',
      menuType: 'pop',
      id: menu.id,
      parentId: `${ap.id}PopFolder`,
      parentTableId: ap.id,
      urlLabel: menu.id,
      label: menu.label,
      status: menu.status,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'Populationen', menu.id],
      hasChildren: true,
    }

    const ref = useRef(null)

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === menu.id,
      ).length > 0

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
              transitionState={state}
              ref={ref}
            />
            <TransitionGroup component={null}>
              {isOpen && (
                <PopFolders
                  projekt={projekt}
                  ap={ap}
                  pop={menu}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
