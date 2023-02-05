import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'
import AssozArt from './AssozArt'

const AssozArtFolder = ({ projekt, ap, count, isLoading }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.assozart ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'assoziierte-Arten']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'assoziierte-Arten',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'assozartFolder',
    id: `${ap.id}AssozartFolder`,
    tableId: ap.id,
    urlLabel: 'assoziierte-Arten',
    label: `assoziierte Arten (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={node.id} node={node} />
      {isOpen && <AssozArt projekt={projekt} ap={ap} />}
    </>
  )
}

export default observer(AssozArtFolder)
