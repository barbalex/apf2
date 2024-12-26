import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { ZaehlFolder } from './Folders/ZaehlFolder/index.jsx'
import { TpopfreiwkontrFolders } from './Folders/index.jsx'
import { useTpopfreiwkontrNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfreiwkontrNavData.js'
import { nodeFromMenu } from '../../../../../../../../../../../../../nodeFromMenu.js'
import { checkIfIsOpen } from '../../../../../../../../../../../../../checkIfIsOpen.js'

export const Tpopfreiwkontr = memo(
  observer(({ projekt, ap, pop, tpop, menu, inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopfreiwkontrNavData(menu.fetcherParams)

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
              {isOpen && (
                <TpopfreiwkontrFolders
                  projekt={projekt}
                  ap={ap}
                  pop={pop}
                  tpop={tpop}
                  navData={navData}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
