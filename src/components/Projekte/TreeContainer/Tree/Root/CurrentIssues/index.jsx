import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import max from 'lodash/max'

import { Row } from '../../Row.jsx'
import { StoreContext } from '../../../../../../storeContext.js'
import { Issues } from './Issues.jsx'

export const CurrentIssuesFolder = memo(
  observer(({ count, isLoading }) => {
    const store = useContext(StoreContext)

    let message = isLoading && !count ? '...' : max([count - 1, 0])

    const isOpen = store.tree.openNodes.some(
      (nodeArray) => nodeArray[0] === 'Aktuelle-Fehler',
    )

    const node = {
      nodeType: 'folder',
      menuType: 'currentIssuesFolder',
      id: 'currentIssuesFolder',
      urlLabel: 'Aktuelle-Fehler',
      label: `Aktuelle Fehler (${message})`,
      url: ['Aktuelle-Fehler'],
      hasChildren: count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && <Issues />}
      </>
    )
  }),
)
