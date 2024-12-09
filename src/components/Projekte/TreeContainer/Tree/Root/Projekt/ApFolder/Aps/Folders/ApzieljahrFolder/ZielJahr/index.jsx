import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../mobxContext.js'
import { Ziels } from './Ziels.jsx'

export const Zieljahr = memo(
  observer(({ projekt, ap, menu, inProp }) => {
    const store = useContext(MobxContext)

    const { id, label, jahr } = menu

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'AP-Ziele' &&
          n[5] === jahr,
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'zieljahrFolder',
      id: `${ap.id}Ziele${jahr ?? 'keinJahr'}`,
      jahr,
      parentId: ap.id,
      urlLabel: `${jahr ?? 'kein Jahr'}`,
      label,
      url: ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Ziele', jahr],
      hasChildren: true,
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
              ref={ref}
              transitionState={state}
            />
            <TransitionGroup component={null}>
              {isOpen && (
                <Ziels
                  projekt={projekt}
                  ap={ap}
                  jahr={jahr}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
