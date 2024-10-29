import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../../../../Row'
import { StoreContext } from '../../../../../../../../../../../../../storeContext.js'
import PopBer from './PopBer'

const PopberFolder = ({ projekt, ap, pop, isLoading, count }) => {
  const store = useContext(StoreContext)

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
      <Row node={node} />
      {isOpen && <PopBer projekt={projekt} ap={ap} pop={pop} />}
    </>
  )
}

export default observer(PopberFolder)
