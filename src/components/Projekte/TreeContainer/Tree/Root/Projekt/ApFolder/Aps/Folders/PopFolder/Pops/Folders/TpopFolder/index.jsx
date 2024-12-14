import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { TransitionGroup } from 'react-transition-group'

import { Row } from '../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../mobxContext.js'
import { Tpops } from './Tpops/index.jsx'

export const TpopFolder = memo(
  observer(({ projekt, ap, pop, menu }) => {
    const store = useContext(MobxContext)

    const url = [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'Populationen',
      pop.id,
      'Teil-Populationen',
    ]

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Teil-Populationen',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopFolder',
      id: `${pop.id}TpopFolder`,
      tableId: pop.id,
      parentTableId: pop.id,
      urlLabel: 'Teil-Populationen',
      label: menu.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        <TransitionGroup component={null}>
          {isOpen && (
            <Tpops
              projekt={projekt}
              ap={ap}
              pop={pop}
            />
          )}
        </TransitionGroup>
      </>
    )
  }),
)
