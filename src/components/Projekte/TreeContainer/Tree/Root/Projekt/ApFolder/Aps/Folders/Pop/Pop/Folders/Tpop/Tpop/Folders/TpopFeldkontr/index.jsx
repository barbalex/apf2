import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../storeContext'
import TpopFeldkontr from './TpopFeldkontr'

const TpopFeldkontrFolder = ({ projekt, ap, pop, tpop, isLoading, count }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopkontr ?? ''

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
    'Feld-Kontrollen',
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
        n[8] === 'Feld-Kontrollen',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'tpopfeldkontrFolder',
    id: `${tpop.id}TpopfeldkontrFolder`,
    tableId: tpop.id,
    urlLabel: 'Feld-Kontrollen',
    label: `Feld-Kontrollen (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={`${node.id}`} node={node} />
      {isOpen && (
        <TpopFeldkontr
          key={`${tpop.id}TPopFeldkontrFolderFeldkontrs`}
          projekt={projekt}
          ap={ap}
          pop={pop}
          tpop={tpop}
        />
      )}
    </>
  )
}

export default observer(TpopFeldkontrFolder)
