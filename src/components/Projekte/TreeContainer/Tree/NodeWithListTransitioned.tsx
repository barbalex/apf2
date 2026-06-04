import { useRef } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'
import { isEqual } from 'es-toolkit'
import { useAtomValue } from 'jotai'

import { Row } from './Row.tsx'
import { NodesList } from './NodesList/index.tsx'
import { nodeFromMenu } from './nodeFromMenu.ts'
import { checkIfIsOpen } from './checkIfIsOpen.ts'
import { Folders } from './Folders.tsx'
import { treeOpenNodesAtom } from '../../../../store/index.ts'

export const NodeWithListTransitioned = ({
  menu,
  in: inPropLocal,
  inProp: inPropPassedFromAbove,
  // enables transitioning grandchildren. Example: Zielber
  parentTransitionState,
}) => {
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const isOpen = checkIfIsOpen({ menu, openNodes })
  const node = nodeFromMenu(menu)
  const ref = useRef(null)

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
              !!parentTransitionState && parentTransitionState !== 'entered' ?
                parentTransitionState
              : state
            }
          />
          {!!menu.fetcherName && isOpen && (
            <TransitionGroup component={null}>
              {!!menu.childrenAreFolders ?
                <Folders menu={menu} />
              : <NodesList
                  menu={menu}
                  parentTransitionState={
                    menu.passTransitionStateToChildren ? state : undefined
                  }
                />
              }
            </TransitionGroup>
          )}
        </>
      )}
    </Transition>
  )
}
