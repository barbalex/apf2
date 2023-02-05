import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../Row'
import storeContext from '../../../../../../../../../../storeContext'
import EkFrequenz from './EkFrequenz'

const EkFrequenzFolder = ({ projekt, ap, count, isLoading }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ekfrequenz ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Frequenzen']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'EK-Frequenzen',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'ekfrequenzFolder',
    id: `${ap.id}Ekfrequenz`,
    tableId: ap.id,
    urlLabel: 'EK-Frequenzen',
    label: `EK-Frequenzen (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={node.id} node={node} />
      {isOpen && <EkFrequenz projekt={projekt} ap={ap} />}
    </>
  )
}

export default observer(EkFrequenzFolder)
