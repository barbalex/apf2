import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../storeContext'

const TpopFolder = ({ projekt, ap, pop, isLoading, count }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpop ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = [
    'Projekte',
    projekt.id,
    'Arten',
    ap.id,
    'Populationen',
    pop.id,
    'Teil-Populationen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'Populationen' &&
        n[5] === pop.id &&
        n[6] === 'Teil-Populationen',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'tpopFolder',
    id: `${pop.id}TpopFolder`,
    tableId: pop.id,
    parentTableId: pop.id,
    urlLabel: 'Teil-Populationen',
    label: `Teil-Populationen (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={`${node.id}`} node={node} />
      {isOpen && <div>tpop</div>}
    </>
  )
}

export default observer(TpopFolder)
