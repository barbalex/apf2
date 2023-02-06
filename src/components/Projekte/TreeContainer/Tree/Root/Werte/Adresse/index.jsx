import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../storeContext'
import Row from '../../../Row'
import AdresseNodes from './Adresse'

const AdressesFolder = ({ count, isLoading }) => {
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const nodeLabelFilterString = nodeLabelFilter?.adresse ?? ''

  let message = isLoading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  const isOpen =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Werte-Listen' && n[1] === 'Adressen',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'adresseFolder',
    id: 'adresseFolder',
    urlLabel: 'Adressen',
    label: `Adressen (${message})`,
    url: ['Werte-Listen', 'Adressen'],
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && <AdresseNodes />}
    </>
  )
}

export default observer(AdressesFolder)
