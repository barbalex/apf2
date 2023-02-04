import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../storeContext'

const PopberFolder = ({ projekt, ap, pop, isLoading, count }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.popber ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'Populationen' &&
        n[5] === pop.id &&
        n[6] === 'Kontroll-Berichte',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'popberFolder',
    id: `${pop.id}PopberFolder`,
    tableId: pop.id,
    urlLabel: 'Kontroll-Berichte',
    label: `Kontroll-Berichte (${message})`,
    url: [
      'Projekte',
      projekt.id,
      'Arten',
      ap.id,
      'Populationen',
      pop.id,
      'Kontroll-Berichte',
    ],
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={`${node.id}`} node={node} />
      {isOpen && <div>PopBer</div>}
    </>
  )
}

export default observer(PopberFolder)
