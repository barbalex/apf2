import { memo, useRef, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { MobxContext } from '../../../../../../../../../../../../../../mobxContext.js'
import { Row } from '../../../../../../../../../../Row.jsx'
import { TpopFolders } from './Folders/index.jsx'
import { useTpopNavData } from '../../../../../../../../../../../../../../modules/useTpopNavData.js'
import { nodeFromMenu } from '../../../../../../../../../../nodeFromMenu.js'
import { checkIfIsOpen } from '../../../../../../../../../../checkIfIsOpen.js'

export const Tpop = memo(
  observer(({ menu, inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopNavData(menu.fetcherParams)

    const isOpen = checkIfIsOpen({ store, menu: navData })

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
              {isOpen && <TpopFolders menu={menu} />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
