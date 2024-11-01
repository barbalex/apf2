import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import { Pop } from './Pop/index.jsx'

export const PopFolder = observer(({ projekt, ap, count, isLoading }) => {
  const store = useContext(StoreContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.pop ?? ''

  const message =
    isLoading ? '...'
    : nodeLabelFilterString ? `${count} gefiltert`
    : count

  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'Populationen']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'Populationen',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'popFolder',
    id: `${ap.id}PopFolder`,
    tableId: ap.id,
    urlLabel: 'Populationen',
    label: `Populationen (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && (
        <Pop
          projekt={projekt}
          ap={ap}
        />
      )}
    </>
  )
})
