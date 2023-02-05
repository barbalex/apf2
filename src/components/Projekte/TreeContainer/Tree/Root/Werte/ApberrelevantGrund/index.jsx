import { useContext } from 'react'
import { observer } from 'mobx-react-lite'

import storeContext from '../../../../../../../storeContext'
import Row from '../../../Row'

const ApberrelevantGrundFolder = ({ count, isLoading }) => {
  const store = useContext(storeContext)
  const { nodeLabelFilter } = store.tree

  const nodeLabelFilterString = nodeLabelFilter?.apberrelevantGrundWerte ?? ''

  let message = isLoading && !count ? '...' : count
  if (nodeLabelFilterString) {
    message = `${count} gefiltert`
  }

  const isOpen =
    store.tree.openNodes.filter(
      (n) => n[0] === 'Werte-Listen' && n[1] === 'ApberrelevantGrundWerte',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'tpopApberrelevantGrundWerteFolder',
    id: 'tpopApberrelevantGrundWerteFolder',
    urlLabel: 'ApberrelevantGrundWerte',
    label: `Teil-Population: Grund für AP-Bericht Relevanz (${message})`,
    url: ['Werte-Listen', 'ApberrelevantGrundWerte'],
    hasChildren: count > 0,
  }

  return <Row key="wlApberrelevantGrundFolder" node={node} />
}

export default observer(ApberrelevantGrundFolder)
