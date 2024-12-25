import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'
import { getSnapshot } from 'mobx-state-tree'

import { Row } from './Row.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { NodesList } from './NodesList/index.jsx'
import { nodeFromMenu } from './nodeFromMenu.js'

export const NodeListFolderTransitioned = memo(
  observer(({ menu, in: inLocal, inProp: inPropFromHigherUp }) => {
    const store = useContext(MobxContext)
    const inProp = inLocal ?? inPropFromHigherUp

    const isOpen =
      menu.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )
      )

    const node = nodeFromMenu(menu)

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
              {isOpen && <NodesList menu={menu} />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
