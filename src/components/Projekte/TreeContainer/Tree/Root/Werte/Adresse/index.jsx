import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../../../../storeContext.js'
import { Row } from '../../../Row.jsx'
import { Adresse } from './Adresse.jsx'

export const AdresseFolder = memo(
  observer(({ menu }) => {
    const store = useContext(StoreContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) => n[0] === 'Werte-Listen' && n[1] === 'Adressen',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'adresseFolder',
      id: 'adresseFolder',
      urlLabel: 'Adressen',
      label: menu?.label,
      url: ['Werte-Listen', 'Adressen'],
      hasChildren: menu?.count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && <Adresse />}
      </>
    )
  }),
)
