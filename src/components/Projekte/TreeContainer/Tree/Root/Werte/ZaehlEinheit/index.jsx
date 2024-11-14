import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../../../../storeContext.js'
import { Row } from '../../../Row.jsx'
import { ZaehlEinheit } from './ZaehlEinheit.jsx'

export const ZaehlEinheitFolder = memo(
  observer(({ count, isLoading }) => {
    const store = useContext(StoreContext)
    const { nodeLabelFilter } = store.tree

    const nodeLabelFilterString =
      nodeLabelFilter?.tpopkontrzaehlEinheitWerte ?? ''

    let message = isLoading && !count ? '...' : count
    if (nodeLabelFilterString) {
      message = `${count} gefiltert`
    }

    const isOpen =
      store.tree.openNodes.filter(
        (n) => n[0] === 'Werte-Listen' && n[1] === 'TpopkontrzaehlEinheitWerte',
      ).length > 0

    const node = {
      nodeType: 'folder',
      menuType: 'tpopkontrzaehlEinheitWerteFolder',
      id: 'tpopkontrzaehlEinheitWerteFolder',
      urlLabel: 'TpopkontrzaehlEinheitWerte',
      label: `Teil-Population: Zähl-Einheiten (${message})`,
      url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
      hasChildren: count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && <ZaehlEinheit />}
      </>
    )
  }),
)
