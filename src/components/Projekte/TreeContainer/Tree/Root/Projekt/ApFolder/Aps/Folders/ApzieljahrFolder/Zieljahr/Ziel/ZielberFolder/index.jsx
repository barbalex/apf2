import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { Row } from '../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../mobxContext.js'
import { Zielbers } from './Zielbers.jsx'
import { useZielbersNavData } from '../../../../../../../../../../../../../modules/useZielbersNavData.js'

export const ZielberFolder = memo(
  observer(({ projekt, ap, jahr, menu, in: inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useZielbersNavData({
      projId: projekt.id,
      apId: ap.id,
      jahr,
      zielId: menu.id,
    })

    const isOpen = store.tree.openNodes.some((n) =>
      isEqual(n.slice(0, navData.treeUrl.length), navData.treeUrl),
    )

    const node = {
      nodeType: navData.treeNodeType,
      menuType: navData.treeMenuType,
      id: navData.treeId,
      tableId: navData.treeTableId,
      urlLabel: navData.id,
      label: navData.label,
      url: navData.treeUrl,
      hasChildren: navData.hasChildren,
    }

    const ref = useRef(null)

    if (!navData) return null

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
                <Zielbers
                  projekt={projekt}
                  ap={ap}
                  jahr={jahr}
                  ziel={menu}
                  menus={navData.menus}
                  parentTransitionState={state}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
