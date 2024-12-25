import { memo, useContext, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { Transition, TransitionGroup } from 'react-transition-group'
import styled from '@emotion/styled'

import {
  Row,
  transitionStyles,
} from '../../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../../mobxContext.js'
import { useTpopfeldkontrNavData } from '../../../../../../../../../../../../../../../../../modules/useTpopfeldkontrNavData.js'
import { TpopfeldkontrFolders } from './Folders/index.jsx'

const Container = styled.div`
  transition: opacity 300ms ease-in-out;
`

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
      singleElementName: 'Feld-Kontrolle',
      id: navData.id,
      parentId: `${tpop.id}TpopfeldkontrFolder`,
      parentTableId: tpop.id,
      urlLabel: navData.id,
      label: navData.label,
      labelRightElements: navData.labelRightElements,
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
              {isOpen && <TpopfeldkontrFolders navData={navData} />}
            </TransitionGroup>
          </>
        )}
      </Transition>
    )
  }),
)
