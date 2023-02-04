import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const ApBerFolder = ({ projekt, ap, count, isLoading }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.apber ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Berichte']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'AP-Berichte',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'apberFolder',
    id: `${ap.id}ApberFolder`,
    tableId: ap.id,
    urlLabel: 'AP-Berichte',
    label: `AP-Berichte (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={node.id} node={node} />
      {isOpen && <div>ApBers</div>}
    </>
  )
}

export default observer(ApBerFolder)
