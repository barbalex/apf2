import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import sum from 'lodash/sum'

import { Row } from '../../../../../../Row.jsx'
import { StoreContext } from '../../../../../../../../../../storeContext.js'
import BeobNichtZuzuordnens from './BeobNichtZuzuordnens'

const BeobNichtZuzuordnenFolder = ({ projekt, ap, aparts, isLoading }) => {
  const store = useContext(StoreContext)

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.beob ?? ''

  const counts = aparts.map(
    (a) => a.aeTaxonomyByArtId?.beobsByArtId?.totalCount ?? 0,
  )
  const count = sum(counts)
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
    'nicht-zuzuordnende-Beobachtungen',
  ]

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 &&
        n[1] === projekt.id &&
        n[3] === ap.id &&
        n[4] === 'nicht-zuzuordnende-Beobachtungen',
    ).length > 0

  const node = {
    nodeType: 'folder',
    menuType: 'beobNichtZuzuordnenFolder',
    id: `${ap.id}BeobNichtZuzuordnenFolder`,
    tableId: ap.id,
    urlLabel: 'nicht-zuzuordnende-Beobachtungen',
    label: `Beobachtungen nicht zuzuordnen (${message})`,
    url,
    hasChildren: count > 0,
  }

  return (
    <>
      <Row node={node} />
      {isOpen && <BeobNichtZuzuordnens projekt={projekt} ap={ap} />}
    </>
  )
}

export default observer(BeobNichtZuzuordnenFolder)
