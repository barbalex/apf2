import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../../../../Row.jsx'
import { MobxContext } from '../../../../../../../../../../../../../../../../mobxContext.js'
import { TpopBer } from './TpopBer.jsx'

export const TpopberFolder = memo(
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
      'Kontroll-Berichte',
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
          n[8] === 'Kontroll-Berichte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopberFolder',
      id: `${tpop.id}TpopberFolder`,
      tableId: tpop.id,
      urlLabel: 'Kontroll-Berichte',
      label: menu.label,
      url,
      hasChildren: true,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <TpopBer
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