import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../Row'
import storeContext from '../../../../../../../storeContext'
import Aps from './Aps'

const Ap = ({ count, projekt }) => {
  const store = useContext(storeContext)
  const { openNodes } = store.tree
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ap ?? ''

  const message = nodeLabelFilterString ? `${count} gefiltert` : count

  const isOpen =
    openNodes.filter(
      (n) => n[0] === 'Projekte' && n[1] === projekt.id && n[2] === 'Arten',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'apFolder',
    id: `${projekt.id}ApFolder`,
    tableId: projekt.id,
    urlLabel: 'Arten',
    label: `Arten (${message})`,
    url: ['Projekte', projekt.id, 'Arten'],
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key={`${projekt.id}ApFolder`} node={node} />
      {isOpen && <Aps key={`${projekt.id}Aps`} projekt={projekt} />}
    </>
  )
}

export default observer(Ap)
