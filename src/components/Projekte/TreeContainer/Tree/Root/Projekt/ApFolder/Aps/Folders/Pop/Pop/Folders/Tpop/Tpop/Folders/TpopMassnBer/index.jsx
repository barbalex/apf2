import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../../../../../../../../../../Row'
import storeContext from '../../../../../../../../../../../../../../../../storeContext'
import TpopMassnBer from './TpopMassnBer'

const TpopMassnBerFolder = ({ projekt, ap, pop, tpop, isLoading, count }) => {
  const store = useContext(storeContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.tpopmassnber ?? ''

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
    'Massnahmen-Berichte',
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
        n[8] === 'Massnahmen-Berichte',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'tpopmassnberFolder',
    id: `${tpop.id}TpopmassnberFolder`,
    tableId: tpop.id,
    urlLabel: 'Massnahmen-Berichte',
    label: `Massnahmen-Berichte (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && (
        <TpopMassnBer projekt={projekt} ap={ap} pop={pop} tpop={tpop} />
      )}
    </>
  )
}

export default observer(TpopMassnBerFolder)
