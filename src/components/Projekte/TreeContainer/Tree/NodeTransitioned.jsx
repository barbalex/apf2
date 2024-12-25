import { memo, useRef, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import { NodeListFolderTransitioned } from './NodeListFolderTransitioned.jsx'
import { NodesList } from './NodesList/index.jsx'
import isEqual from 'lodash/isEqual'

import { Row } from './Row.jsx'
import { MobxContext } from '../../../../mobxContext.js'

export const NodeTransitioned = memo(
  observer(({ menu, in: inProp, inProp: inPropPassedFromAbove }) => {
    const store = useContext(MobxContext)

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
      alwaysOpen: menu.alwaysOpen,
    }

    const ref = useRef(null)

    const isOpen =
      menu.alwaysOpen ? true
      : menu.treeUrl?.length ?
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )
      : false

    console.log('NodeTransitioned', { menu, isOpen, node })

    return (
      <Transition
        in={inProp ?? inPropPassedFromAbove}
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
            {!!menu.fetcherName && (
              <TransitionGroup component={null}>
                {isOpen && <NodesList menu={menu} />}
              </TransitionGroup>
            )}
          </>
        )}
      </Transition>
    )
  }),
)
