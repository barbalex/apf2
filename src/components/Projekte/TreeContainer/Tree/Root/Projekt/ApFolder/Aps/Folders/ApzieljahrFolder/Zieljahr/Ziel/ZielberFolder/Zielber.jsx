import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../../../../Row.jsx'

export const Zielber = memo(
  ({ projekt, ap, jahr, ziel, menu, inProp, parentTransitionState }) => {
    const node = {
      nodeType: menu.treeNodeType,
      menuType: menu.treeMenuType,
      id: menu.treeId,
      tableId: menu.treeTableId,
      urlLabel: menu.id,
      label: menu.label,
      url: menu.treeUrl,
      hasChildren: menu.hasChildren,
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
            // also transition if parent is entering
            transitionState={
              parentTransitionState !== 'entered' ?
                parentTransitionState
              : state
            }
          />
        )}
      </Transition>
    )
  },
)
