import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../mobxContext.js'
import { ApFolders } from './Folders/index.jsx'
import { useApNavData } from '../../../../../../../../modules/useApNavData.js'
import { nodeFromMenu } from '../../../../nodeFromMenu.js'

export const Ap = memo(
  observer(({ projekt, ap, inProp }) => {
    const store = useContext(MobxContext)
    const { openNodes } = store.tree

    const { navData } = useApNavData({ projId: projekt.id, apId: ap.id })

    const ref = useRef(null)

    const isOpen = openNodes.some(
      (n) =>
        n[0] === 'Projekte' &&
        n[1] === projekt.id &&
        n[2] === 'Arten' &&
        n[3] === ap.id,
    )
    // TODO: UUPs. This is way too slow
    // const isOpen =
    //   navData.alwaysOpen ? true : (
    //     store.tree.openNodes.some((n) =>
    //       isEqual(n.slice(0, navData.treeUrl.length), navData.treeUrl),
    //     )
    //   )

    const url = ['Projekte', projekt.id, 'Arten', ap.id]

    const node = nodeFromMenu(navData)

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
                <ApFolders
                  ap={ap}
                  projekt={projekt}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
