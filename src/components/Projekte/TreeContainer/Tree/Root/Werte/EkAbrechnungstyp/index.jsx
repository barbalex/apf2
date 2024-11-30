import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../../../../storeContext.js'
import { Row } from '../../../Row.jsx'
import { EkAbrechnungstyp } from './EkAbrechnungstyp.jsx'

export const EkAbrechnungstypFolder = memo(
  observer(({ menu }) => {
    const store = useContext(StoreContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) => n[0] === 'Werte-Listen' && n[1] === 'EkAbrechnungstypWerte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'ekAbrechnungstypWerteFolder',
      id: 'ekAbrechnungstypWerteFolder',
      urlLabel: 'EkAbrechnungstypWerte',
      label: menu?.label,
      url: ['Werte-Listen', 'EkAbrechnungstypWerte'],
      hasChildren: menu?.count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && <EkAbrechnungstyp />}
      </>
    )
  }),
)
