import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../mobxContext.js'
import { Tpopmassns } from './Tpopmassns.jsx'

export const TpopmassnFolder = memo(
  observer(({ projekt, ap, pop, tpop, menu }) => {
    const store = useContext(MobxContext)

    const url = [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'Populationen',
      pop.id,
      'Teil-Populationen',
      tpop.id,
      'Massnahmen',
    ]

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Teil-Populationen' &&
          n[7] === tpop.id &&
          n[8] === 'Massnahmen',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopmassnFolder',
      id: `${tpop.id}TpopmassnFolder`,
      tableId: tpop.id,
      urlLabel: 'Massnahmen',
      label: menu.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Tpopmassns
              projekt={projekt}
              ap={ap}
              pop={pop}
              tpop={tpop}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
