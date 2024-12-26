import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../mobxContext.js'
import { ZielberFolder } from './ZielberFolder/index.jsx'
import { NodeListFolderTransitioned } from '../../../../../../../../NodeListFolderTransitioned.jsx'
import { NodeTransitioned } from '../../../../../../../../NodeTransitioned.jsx'
import { nodeFromMenu } from '../../../../../../../../nodeFromMenu.js'

export const Ziel = memo(
  observer(({ menu, inProp }) => {
    const store = useContext(MobxContext)

    const node = nodeFromMenu(menu)

    const ref = useRef(null)

    const isOpen =
      menu.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )
      )

    // console.log('Ziel', { node, menu })

    // return (
    //   <NodeListFolderTransitioned
    //     menu={menu}
    //     inProp={inProp}
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
              {isOpen && <ZielberFolder menu={menu} />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
