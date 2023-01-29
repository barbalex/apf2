import sum from 'lodash/sum'

const beobNichtBeurteiltFolderNode = ({
  data,
  loading,
  projId,
  apId,
  store,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.beob ?? ''

  const aparts = data?.apById?.beobNichtBeurteilt?.nodes ?? []
  const counts = aparts.map(
    (a) => a.aeTaxonomyByArtId?.beobsByArtId?.totalCount ?? 0,
  )
  const count = sum(counts)

  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  const url = [
    'Projekte',
    projId,
    'Arten',
    apId,
    'nicht-beurteilte-Beobachtungen',
  ]

  return {
    nodeType: 'folder',
    menuType: 'beobNichtBeurteiltFolder',
    filterTable: 'beob',
    id: `${apId}BeobNichtBeurteiltFolder`,
    tableId: apId,
    urlLabel: 'nicht-beurteilte-Beobachtungen',
    label: `Beobachtungen nicht beurteilt (${message})`,
    url,
    hasChildren: count > 0,
  }
}

export default beobNichtBeurteiltFolderNode
