import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import Row from '../../../Row'
import storeContext from '../../../../../../../storeContext'
import Apberuebersichts from './Apberuebersichts'

const ApberuebersichtNode = ({ count, projekt }) => {
  const store = useContext(storeContext)
  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.apberuebersicht ?? ''

  const message = nodeLabelFilterString ? `${count} gefiltert` : count

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n[0] === 'Projekte' && n[1] === projekt.id && n[2] === 'AP-Berichte',
    ).length > 0

  const node = {
    menuType: 'apberuebersichtFolder',
    id: `${projekt.id}/ApberuebersichtsFolder`,
    tableId: projekt.id,
    urlLabel: 'AP-Berichte',
    label: `AP-Berichte (${message})`,
    url: ['Projekte', projekt.id, 'AP-Berichte'],
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && <Apberuebersichts />}
    </>
  )
}

export default observer(ApberuebersichtNode)
