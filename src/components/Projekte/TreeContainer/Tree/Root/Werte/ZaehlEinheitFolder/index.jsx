import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'

import { MobxContext } from '../../../../../../../mobxContext.js'
import { Row } from '../../../Row.jsx'
import { ZaehlEinheits } from './ZaehlEinheits.jsx'

export const ZaehlEinheitFolder = memo(
  observer(({ menu, in: inProp }) => {
    const store = useContext(MobxContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) => n[0] === 'Werte-Listen' && n[1] === 'TpopkontrzaehlEinheitWerte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopkontrzaehlEinheitWerteFolder',
      id: 'tpopkontrzaehlEinheitWerteFolder',
      urlLabel: 'TpopkontrzaehlEinheitWerte',
      label: menu?.label,
      url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
      hasChildren: menu?.count > 0,
    }

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
            <Row
              node={node}
              transitionState={state}
              ref={ref}
            />
            <TransitionGroup component={null}>
              {isOpen && <ZaehlEinheits />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
