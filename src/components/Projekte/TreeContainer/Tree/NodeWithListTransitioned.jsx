import { memo, useRef, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import { NodesList } from './NodesList/index.jsx'
import isEqual from 'lodash/isEqual'

import { Row } from './Row.jsx'
import { MobxContext } from '../../../../mobxContext.js'
import { nodeFromMenu } from './nodeFromMenu.js'
import { checkIfIsOpen } from './checkIfIsOpen.js'

export const NodeWithListTransitioned = memo(
  observer(
    ({
      menu,
      in: inPropLocal,
      inProp: inPropPassedFromAbove,
      // enables transitioning grandchildren. Example: Zielber
      parentTransitionState,
    }) => {
      const store = useContext(MobxContext)

      const node = nodeFromMenu(menu)

      const ref = useRef(null)

      const isOpen = checkIfIsOpen({ menu, store })

      // console.log('NodeTransitioned', { menu, isOpen, node })

      return (
        <Transition
          in={inPropLocal ?? inPropPassedFromAbove}
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
                transitionState={
                  !!parentTransitionState && parentTransitionState !== 'entered'
                    ? parentTransitionState
                    : state
                }
              />
              {!!menu.fetcherName && (
                <TransitionGroup component={null}>
                  {isOpen && (
                    <NodesList
                      menu={menu}
                      parentTransitionState={
                        menu.passTransitionStateToChildren ? state : undefined
                      }
                    />
                  )}
                </TransitionGroup>
              )}
            </>
          )}
        </Transition>
      )
    },
  ),
)
