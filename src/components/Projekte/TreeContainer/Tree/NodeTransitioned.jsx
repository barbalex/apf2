import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from './Row.jsx'

export const NodeTransitioned = memo(
  ({ menu, in: inProp, inProp: inPropPassedFromAbove }) => {
    const node = {
      nodeType: menu.treeNodeType,
      menuType: menu.treeMenuType,
      id: menu.treeId,
      tableId: menu.treeTableId,
      parentId: menu.treeParentId,
      parentTableId: menu.treeParentTableId,
      urlLabel: menu.id,
      label: menu.label,
      labelLeftElements: menu.labelLeftElements,
      url: menu.treeUrl,
      hasChildren: menu.hasChildren,
    }

    const ref = useRef(null)

    // console.log('NodeTransitioned, node:', {
    //   node,
    //   menu,
    //   inProp,
    //   inPropPassedFromAbove,
    // })

    return (
      <Transition
        in={inProp ?? inPropPassedFromAbove}
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
