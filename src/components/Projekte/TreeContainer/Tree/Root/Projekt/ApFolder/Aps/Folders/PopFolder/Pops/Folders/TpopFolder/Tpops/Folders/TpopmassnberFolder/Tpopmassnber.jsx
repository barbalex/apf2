import { memo, useRef } from 'react'
import { Transition } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { useTpopmassnbersNavData } from '../../../../../../../../../../../../../../../../modules/useTpopmassnbersNavData.js'

export const Tpopmassnber = memo(({ projekt, ap, pop, tpop, menu, inProp }) => {
  const node = {
    nodeType: 'table',
    menuType: 'tpopmassnber',
    parentId: tpop.id,
    parentTableId: tpop.id,
    id: menu.id,
    urlLabel: menu.id,
    label: menu.label,
    url: [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'Populationen',
      pop.id,
      'Teil-Populationen',
      tpop.id,
      'Massnahmen-Berichte',
      menu.id,
    ],
    hasChildren: false,
  }

  const ref = useRef(null)

  return (
    <Transition
      nodeRef={ref}
      in={inProp}
      timeout={300}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <Row
          node={node}
          ref={ref}
          transitionState={state}
        />
      )}
    </Transition>
  )
})
