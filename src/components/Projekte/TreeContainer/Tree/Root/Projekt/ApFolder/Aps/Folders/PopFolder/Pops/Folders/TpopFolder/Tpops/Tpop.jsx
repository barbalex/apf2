import { memo, useRef, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import isEqual from 'lodash/isEqual'

import { MobxContext } from '../../../../../../../../../../../../../../mobxContext.js'
import { Row } from '../../../../../../../../../../Row.jsx'
import { TpopFolders } from './Folders/index.jsx'
import { useTpopNavData } from '../../../../../../../../../../../../../../modules/useTpopNavData.js'

// TODO: get rid of having to pass projekt, ap, pop
export const Tpop = memo(
  observer(({ projekt, ap, pop, menu, inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopNavData(menu.fetcherParams)

    const isOpen =
      navData.alwaysOpen ? true : (
        store.tree.openNodes.some((n) =>
          isEqual(n.slice(0, navData.treeUrl.length), navData.treeUrl),
        )
      )

    const node = {
      nodeType: 'table',
      menuType: 'tpop',
      singleElementName: 'Teil-Population',
      id: menu.id,
      parentId: `${pop.id}TpopFolder`,
      parentTableId: pop.id,
      urlLabel: menu.id,
      label: menu.label,
      labelLeftElements: menu.labelLeftElements,
      labelRightElements: menu.labelRightElements,
      status: menu.status,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
        menu.id,
      ],
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
                <TpopFolders
                  projekt={projekt}
                  ap={ap}
                  pop={pop}
                  tpop={menu}
                />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
