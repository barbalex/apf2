import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import EkZaehleinheits from './EkZaehleinheits'

const EkZaehleinheitFolder = ({ projekt, ap, count, isLoading }) => {
  const store = useContext(StoreContext)

  const nodeLabelFilterString =
    store.tree?.nodeLabelFilter?.ekzaehleinheit ?? ''

  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = ['Projekte', projekt.id, 'Arten', ap.id, 'EK-Zähleinheiten']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'EK-Zähleinheiten',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'ekzaehleinheitFolder',
    id: `${ap.id}Ekzaehleinheit`,
    tableId: ap.id,
    urlLabel: 'EK-Zähleinheiten',
    label: `EK-Zähleinheiten (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && <EkZaehleinheits projekt={projekt} ap={ap} />}
    </>
  )
}

export default observer(EkZaehleinheitFolder)
