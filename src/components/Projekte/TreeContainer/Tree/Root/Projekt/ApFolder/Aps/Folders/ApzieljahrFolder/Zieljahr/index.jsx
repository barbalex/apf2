import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../mobxContext.js'
import { Ziels } from './Ziels.jsx'
import { NodeListFolderTransitioned } from '../../../../../../../NodeListFolderTransitioned.jsx'
import { nodeFromMenu } from '../../../../../../../nodeFromMenu.js'

export const Zieljahr = memo(
  observer(({ menu, inProp }) => {
    const store = useContext(MobxContext)

    const { id, label, jahr } = menu

    const isOpen =
      menu.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )
      )

    const node = nodeFromMenu(menu)

    const ref = useRef(null)

    // return (
    //   <NodeListFolderTransitioned
    //     menu={menu}
    //     in={inProp}
    //   />
    // )

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
              {isOpen && <Ziels menu={menu} />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
