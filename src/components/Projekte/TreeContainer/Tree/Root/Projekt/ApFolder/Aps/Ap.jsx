import { memo, useContext, useRef, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../mobxContext.js'
import { ApFolders } from './Folders/index.jsx'
import { useApNavData } from '../../../../../../../../modules/useApNavData.js'
import { nodeFromMenu } from '../../../../nodeFromMenu.js'

export const Ap = memo(
  observer(({ inProp, menu }) => {
    const store = useContext(MobxContext)

    const { navData } = useApNavData(menu.fetcherParams)

    const ref = useRef(null)

    const isOpen = navData.alwaysOpen
      ? true
      : store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, navData.treeUrl.length), navData.treeUrl),
        )

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
            <Row node={node} transitionState={state} ref={ref} />
            <TransitionGroup component={null}>
              {isOpen && <ApFolders navData={navData} />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
