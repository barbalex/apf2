import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../mobxContext.js'
import { PopFolders } from './Folders/index.jsx'
import { nodeFromMenu } from '../../../../../../../nodeFromMenu.js'
import { usePopNavData } from '../../../../../../../../../../../modules/usePopNavData.js'

// TODO: get rid of having to pass projekt, ap, pop
export const Pop = memo(
  observer(({ projekt, ap, menu, inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = usePopNavData(menu.fetcherParams)

    const node = nodeFromMenu(navData)

    const ref = useRef(null)

    const isOpen =
      navData.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, navData.treeUrl.length), navData.treeUrl),
        )
      )

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
                <PopFolders
                  projekt={projekt}
                  ap={ap}
                  menu={menu}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
