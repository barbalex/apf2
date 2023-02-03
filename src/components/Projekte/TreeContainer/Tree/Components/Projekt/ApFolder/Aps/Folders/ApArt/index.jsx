import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'

const ApArtFolder = ({ projekt, ap, count, isLoading }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.apart ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'Taxa',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'apartFolder',
    id: `${ap.id}ApartFolder`,
    tableId: ap.id,
    urlLabel: 'Taxa',
    label: `Taxa (${message})`,
    url: ['Projekte', projekt.id, 'Arten', ap.id, 'Taxa'],
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={node.id} node={node} />
      {isOpen && <div>Taxa</div>}
    </>
  )
}

export default observer(ApArtFolder)
