import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../../../../storeContext.js'
import { PopMassnBer } from './PopMassnBer.jsx'

export const PopMassnBerFolder = memo(
  observer(({ projekt, ap, pop, isLoading, count }) => {
    const store = useContext(StoreContext)

    const nodeLabelFilterString = store.tree?.nodeLabelFilter?.popmassnber ?? ''

    const message =
      isLoading ? '...'
      : nodeLabelFilterString ? `${count} gefiltert`
      : count

    const isOpen =
      store.tree.openNodes.filter(
        (n) =>
          n[1] === projekt.id &&
          n[3] === ap.id &&
          n[4] === 'Populationen' &&
          n[5] === pop.id &&
          n[6] === 'Massnahmen-Berichte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'popmassnberFolder',
      id: `${pop.id}PopmassnberFolder`,
      tableId: pop.id,
      urlLabel: 'Massnahmen-Berichte',
      label: `Massnahmen-Berichte (${message})`,
      url: [
        'Projekte',
        projekt.id,
        'Arten',
        ap.id,
        'Populationen',
        pop.id,
        'Massnahmen-Berichte',
      ],
      hasChildren: count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && (
          <PopMassnBer
            projekt={projekt}
            ap={ap}
            pop={pop}
          />
        )}
      </>
    )
  }),
)
