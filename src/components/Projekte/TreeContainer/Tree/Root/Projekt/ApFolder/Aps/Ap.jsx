import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../mobxContext.js'
import { ApFolders } from './Folders/index.jsx'
import { useApsNavData } from '../../../../../../../../modules/useApsNavData.js'

export const Ap = memo(
  observer(({ projekt, ap, inProp }) => {
    const store = useContext(MobxContext)
    const { openNodes } = store.tree

    const ref = useRef(null)

    const isOpen =
      openNodes.filter(
        (n) =>
          n[0] === 'Projekte' &&
          n[1] === projekt.id &&
          n[2] === 'Arten' &&
          n[3] === ap.id,
      ).length > 0

    const url = ['Projekte', projekt.id, 'Arten', ap.id]

    const node = {
      nodeType: 'table',
      menuType: 'ap',
      singleElementName: 'Art',
      id: ap.id,
      parentId: projekt.id,
      parentTableId: projekt.id,
      urlLabel: ap.id,
      label: ap.label,
      url,
      hasChildren: true,
    }

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
