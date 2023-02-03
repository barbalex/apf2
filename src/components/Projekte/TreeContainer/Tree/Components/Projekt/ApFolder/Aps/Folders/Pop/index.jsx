import { useContext } from 'react'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const PopFolder = ({ projekt, ap, count, isLoading }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.pop ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
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
      <Row key={node.id} node={node} />
      {isOpen && <div>pops</div>}
    </>
  )
}

export default PopFolder
