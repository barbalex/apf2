import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../mobxContext.js'
import { TpopFreiwkontr } from './TpopFreiwkontr/index.jsx'

export const TpopFreiwkontrFolder = memo(
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
      'Freiwilligen-Kontrollen',
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
          n[8] === 'Freiwilligen-Kontrollen',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopfreiwkontrFolder',
      id: `${tpop.id}TpopfreiwkontrFolder`,
      tableId: tpop.id,
      urlLabel: 'Freiwilligen-Kontrollen',
      label: menu.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <TpopFreiwkontr
            projekt={projekt}
            ap={ap}
            pop={pop}
            tpop={tpop}
          />
        )}
      </>
    )
  }),
)
