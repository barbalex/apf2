import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../storeContext'
import Row from '../../../Row'
import ZaehlEinheitNodes from './ZaehlEinheit'

const ZaehlEinheitFolder = ({ count, isLoading }) => {
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const nodeLabelFilterString =
    nodeLabelFilter?.tpopkontrzaehlEinheitWerte ?? ''

  let message = isLoading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  const isOpen =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Werte-Listen' && n[1] === 'TpopkontrzaehlEinheitWerte',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'tpopkontrzaehlEinheitWerteFolder',
    id: 'tpopkontrzaehlEinheitWerteFolder',
    urlLabel: 'TpopkontrzaehlEinheitWerte',
    label: `Teil-Population: Zähl-Einheiten (${message})`,
    url: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
    hasChildren: count > 0,
  }

  return (
    <>
      <Row key="wlZaehlEinheitFolder" node={node} />
      {isOpen && <ZaehlEinheitNodes />}
    </>
  )
}

export default observer(ZaehlEinheitFolder)
