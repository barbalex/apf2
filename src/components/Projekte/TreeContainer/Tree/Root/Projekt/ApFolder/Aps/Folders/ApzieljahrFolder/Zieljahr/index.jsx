import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../mobxContext.js'
import { Ziels } from './Ziels.jsx'
import { NodeListFolderTransitioned } from '../../../../../../../NodeListFolderTransitioned.jsx'

export const Zieljahr = memo(
  observer(({ projekt, ap, menu, inProp }) => {
    const store = useContext(MobxContext)

    const { id, label, jahr } = menu

    const isOpen = store.tree.openNodes.some((n) =>
      isEqual(n.slice(0, menu.treeUrl.length), menu.treeUrl),
    )

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

    // console.log('Zieljahr', { node, menu })

    // return (
    //   <NodeListFolderTransitioned
    //     menu={menu}
    //     in={inProp}
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
