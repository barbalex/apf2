import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row'
import { StoreContext } from '../../../../../../../../../../../../../storeContext.js'
import Tpop from './Tpop'

const TpopFolder = ({ projekt, ap, pop, isLoading, count }) => {
  const store = useContext(StoreContext)

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
      <Row node={node} />
      {isOpen && <Tpop projekt={projekt} ap={ap} pop={pop} />}
    </>
  )
}

export default observer(TpopFolder)
