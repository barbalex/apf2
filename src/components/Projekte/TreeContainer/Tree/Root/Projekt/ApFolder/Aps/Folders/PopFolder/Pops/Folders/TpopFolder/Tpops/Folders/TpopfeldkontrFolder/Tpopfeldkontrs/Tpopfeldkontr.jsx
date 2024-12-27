import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'
import styled from '@emotion/styled'

import {
  Row,
  transitionStyles,
} from '../../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { useTpopfeldkontrNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrNavData.js'
import { Folders } from '../../../../../../../../../../../../../Folders.jsx'
// import { Folders } from './Folders.jsx'
import { nodeFromMenu } from '../../../../../../../../../../../../../nodeFromMenu.js'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

export const Tpopfeldkontr = memo(
  observer(({ menu, inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopfeldkontrNavData(menu.fetcherParams)

    const isOpen = menu.alwaysOpen
      ? true
      : store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
        )

    const node = nodeFromMenu(navData)

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
            <Row node={node} ref={ref} transitionState={state} />
            <TransitionGroup component={null}>
              {isOpen && <Folders navData={navData} />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
