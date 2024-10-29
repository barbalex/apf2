import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import ApErfkrit from './ApErfkrit'

const ErfkritFolder = ({ projekt, ap, count, isLoading }) => {
  const store = useContext(StoreContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.erfkrit ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'AP-Erfolgskriterien']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'AP-Erfolgskriterien',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'erfkritFolder',
    id: `${ap.id}ErfkritFolder`,
    tableId: ap.id,
    urlLabel: 'AP-Erfolgskriterien',
    label: `AP-Erfolgskriterien (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && <ApErfkrit projekt={projekt} ap={ap} />}
    </>
  )
}

export default observer(ErfkritFolder)
