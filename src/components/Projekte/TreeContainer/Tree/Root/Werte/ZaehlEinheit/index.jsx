import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../../../../storeContext.js'
import { Row } from '../../../Row.jsx'
import { ZaehlEinheit } from './ZaehlEinheit.jsx'

export const ZaehlEinheitFolder = memo(
  observer(({ menu }) => {
    const store = useContext(StoreContext)

    const isOpen =
      store.tree.openNodes.filter(
        (n) => n[0] === 'Werte-Listen' && n[1] === 'TpopkontrzaehlEinheitWerte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopkontrzaehlEinheitWerteFolder',
      id: 'tpopkontrzaehlEinheitWerteFolder',
      urlLabel: 'TpopkontrzaehlEinheitWerte',
      label: menu?.label,
      url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
      hasChildren: menu?.count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && <ZaehlEinheit />}
      </>
    )
  }),
)
