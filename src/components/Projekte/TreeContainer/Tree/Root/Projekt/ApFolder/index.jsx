import { memo, useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../Row.jsx'
import { StoreContext } from '../../../../../../../storeContext.js'
import { Aps } from './Aps/index.jsx'

export const ApFolder = memo(
  observer(({ count, projekt }) => {
    const store = useContext(StoreContext)
    const { openNodes } = store.tree
    const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ap ?? ''

    const message = nodeLabelFilterString ? `${count} gefiltert` : count

    const isOpen =
      openNodes.filter(
        (n) => n[0] === 'Projekte' && n[1] === projekt.id && n[2] === 'Arten',
      ).length > 0

    const url = ['Projekte', projekt.id, 'Arten']

    const node = {
      nodeType: 'folder',
      menuType: 'apFolder',
      id: `${projekt.id}ApFolder`,
      tableId: projekt.id,
      urlLabel: 'Arten',
      label: `Arten (${message})`,
      url,
      hasChildren: count > 0,
    }

    return (
      <>
        <Row node={node} />
        {isOpen && <Aps projekt={projekt} />}
      </>
    )
  }),
)
