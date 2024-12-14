import { memo, useContext, useRef, useMemo } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { ZaehlFolder } from './ZaehlFolder/index.jsx'
import { useTpopfeldkontrNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrNavData.js'
import { ChildlessFolder } from './ChildlessFolder.jsx'

export const Tpopfeldkontr = memo(
  observer(({ projekt, ap, pop, tpop, menu, inProp }) => {
    const store = useContext(MobxContext)

    const { navData } = useTpopfeldkontrNavData({
      projId: projekt.id,
      apId: ap.id,
      popId: pop.id,
      tpopId: tpop.id,
      tpopkontrId: menu.id,
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
          n[8] === 'Feld-Kontrollen' &&
          n[9] === navData.id,
      ).length > 0

    const node = {
      nodeType: 'table',
      menuType: 'tpopfeldkontr',
      id: navData.id,
      parentId: `${tpop.id}TpopfeldkontrFolder`,
      parentTableId: tpop.id,
      urlLabel: navData.id,
      label: navData.label,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Teil-Populationen',
        tpop.id,
        'Feld-Kontrollen',
        navData.id,
      ],
      hasChildren: true,
    }

    const biotopMenu = useMemo(
      () => navData?.menus?.find?.((menu) => menu.id === 'Biotop'),
      [navData],
    )
    const zaehlMenu = useMemo(
      () => navData?.menus?.find?.((menu) => menu.id === 'Zaehlungen'),
      [navData],
    )
    const dateienMenu = useMemo(
      () => navData?.menus?.find?.((menu) => menu.id === 'Dateien'),
      [navData],
    )

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
            {isOpen && (
              <>
                <ChildlessFolder
                  projekt={projekt}
                  ap={ap}
                  pop={pop}
                  tpop={tpop}
                  menu={biotopMenu}
                  parentUrl={navData.url}
                />
                <ChildlessFolder
                  projekt={projekt}
                  ap={ap}
                  pop={pop}
                  tpop={tpop}
                  menu={dateienMenu}
                  parentUrl={navData.url}
                />
                <ZaehlFolder
                  projekt={projekt}
                  ap={ap}
                  pop={pop}
                  tpop={tpop}
                  tpopkontr={navData}
                  menu={zaehlMenu}
                  parentUrl={navData.url}
                />
              </>
            )}
          </>
        )}
      </Transition>
    )
  }),
)
