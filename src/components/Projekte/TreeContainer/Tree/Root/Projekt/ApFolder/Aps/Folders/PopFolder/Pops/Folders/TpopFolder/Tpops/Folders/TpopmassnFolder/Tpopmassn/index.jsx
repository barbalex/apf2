import { memo, useRef, useContext, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../../Row.jsx'
import { Node } from '../../../../../../../../../../../../../Node.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { ChildlessFolder } from './ChildlessFolder.jsx'
import { useTpopmassnNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopmassnNavData.js'
import { tpopmassn } from '../../../../../../../../../../../../../../../../shared/fragments.js'

export const Tpopmassn = memo(
  observer(({ projekt, ap, pop, tpop, menu, inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopmassnNavData({
      projId: projekt.id,
      apId: ap.id,
      popId: pop.id,
      tpopId: tpop.id,
      tpopmassnId: menu.id,
    })

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n.length > 5 &&
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Teil-Populationen' &&
          n[7] === tpop.id &&
          n[8] === 'Massnahmen' &&
          n[9] === menu.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'tpopmassn',
      singleElementName: 'Massnahme',
      id: menu.id,
      parentId: tpop.id,
      parentTableId: tpop.id,
      urlLabel: menu.id,
      label: menu.label,
      labelRightElements: menu.labelRightElements,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
        tpop.id,
        'Massnahmen',
        menu.id,
      ],
      hasChildren: true,
    }

    const ref = useRef(null)

    const dateienMenu = useMemo(
      () => navData?.menus?.find?.((m) => m.id === 'Dateien'),
      [navData],
    )

    console.log('Tpopmassn, dateienMenu:', dateienMenu)

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
                <Node menu={dateienMenu} />
                // <ChildlessFolder
                //   projekt={projekt}
                //   ap={ap}
                //   pop={pop}
                //   tpop={tpop}
                //   tpopmassn={menu}
                //   menu={dateienMenu}
                //   parentUrl={navData?.url}
                // />
              )}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
