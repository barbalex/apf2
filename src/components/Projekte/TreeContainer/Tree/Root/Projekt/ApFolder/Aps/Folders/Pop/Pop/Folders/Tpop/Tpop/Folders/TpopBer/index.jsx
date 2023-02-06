import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../storeContext'
import TpopBer from './TpopBer'

const TpopBerFolder = ({ projekt, ap, pop, tpop, isLoading, count }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopber ?? ''

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
    'Kontroll-Berichte',
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
        n[8] === 'Kontroll-Berichte',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'tpopberFolder',
    id: `${tpop.id}TpopberFolder`,
    tableId: tpop.id,
    urlLabel: 'Kontroll-Berichte',
    label: `Kontroll-Berichte (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && <TpopBer projekt={projekt} ap={ap} pop={pop} tpop={tpop} />}
    </>
  )
}

export default observer(TpopBerFolder)
