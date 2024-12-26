import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../mobxContext.js'
import { Zielbers } from './Zielbers.jsx'
import { useZielbersNavData } from '../../../../../../../../../../../../../modules/useZielbersNavData.js'
import { nodeFromMenu } from '../../../../../../../../../nodeFromMenu.js'

export const ZielberFolder = memo(
  observer(({ menu, in: inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useZielbersNavData(menu.fetcherParams)

    const isOpen =
      navData.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, navData.treeUrl.length), navData.treeUrl),
        )
      )

    const node = nodeFromMenu(navData)

    const ref = useRef(null)

    if (!navData) return null

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
                <Zielbers
                  menus={navData.menus}
                  parentTransitionState={state}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
