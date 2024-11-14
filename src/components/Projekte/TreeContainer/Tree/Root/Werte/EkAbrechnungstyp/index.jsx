import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../../../../storeContext.js'
import { Row } from '../../../Row.jsx'
import { EkAbrechnungstyp } from './EkAbrechnungstyp.jsx'

export const EkAbrechnungstypFolder = memo(
  observer(({ count, isLoading }) => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter } = store.tree

    const nodeLabelFilterString = nodeLabelFilter?.ekAbrechnungstypWerte ?? ''

    let message = isLoading && !count ? '...' : count
    if (nodeLabelFilterString) {
      message = `${count} gefiltert`
    }

    const isOpen =
      store.tree.openNodes.filter(
        (n) => n[0] === 'Werte-Listen' && n[1] === 'EkAbrechnungstypWerte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'ekAbrechnungstypWerteFolder',
      id: 'ekAbrechnungstypWerteFolder',
      urlLabel: 'EkAbrechnungstypWerte',
      label: `Teil-Population: EK-Abrechnungstypen (${message})`,
      url: ['Werte-Listen', 'EkAbrechnungstypWerte'],
      hasChildren: count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && <EkAbrechnungstyp />}
      </>
    )
  }),
)
