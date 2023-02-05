import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../storeContext'
import BeobZugeordnet from './BeobZugeordnet'

const BeobZugeordnetFolder = ({ projekt, ap, pop, tpop, isLoading, count }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.beob ?? ''

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
    tpop.id,
    'Beobachtungen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'Populationen' &&
        n[5] === pop.id &&
        n[6] === 'Teil-Populationen' &&
        n[7] === tpop.id &&
        n[8] === 'Beobachtungen',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'beobZugeordnetFolder',
    id: `${tpop.id}BeobZugeordnetFolder`,
    tableId: tpop.id,
    urlLabel: 'Beobachtungen',
    label: `Beobachtungen zugeordnet (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={`${node.id}`} node={node} />
      {isOpen && (
        <BeobZugeordnet
          key={`${tpop.id}TPopBeobzugeordnetFolderBeobzugeordnet`}
          projekt={projekt}
          ap={ap}
          pop={pop}
          tpop={tpop}
        />
      )}
    </>
  )
}

export default observer(BeobZugeordnetFolder)
