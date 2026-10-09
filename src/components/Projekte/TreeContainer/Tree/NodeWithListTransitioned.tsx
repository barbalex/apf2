import { useRef } from 'react'
import { Transition, TransitionGroup } from 'react-transition-group'
import { useAtomValue } from 'jotai'
import type { TransitionStatus } from 'react-transition-group'

import { Row } from './Row.tsx'
import { NodesList } from './NodesList/index.tsx'
import { nodeFromMenu } from './nodeFromMenu.ts'
import { checkIfIsOpen } from './checkIfIsOpen.ts'
import { Folders } from './Folders.tsx'
import { treeOpenNodesAtom } from '../../../../store/index.ts'
import type { TreeMenu } from './types.ts'

interface NodeWithListTransitionedProps {
  menu: TreeMenu
  in?: boolean | undefined
  inProp?: boolean | undefined
  // enables transitioning grandchildren. Example: Zielber
  parentTransitionState?: TransitionStatus | undefined
}

export const NodeWithListTransitioned = ({
  menu,
  in: inPropLocal,
  inProp: inPropPassedFromAbove,
  parentTransitionState,
}: NodeWithListTransitionedProps) => {
  const openNodes = useAtomValue(treeOpenNodesAtom)
  const isOpen = checkIfIsOpen({ menu, openNodes })
  const node = nodeFromMenu(menu)
  const ref = useRef<HTMLDivElement | null>(null)

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
              {menu.childrenAreFolders ?
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
