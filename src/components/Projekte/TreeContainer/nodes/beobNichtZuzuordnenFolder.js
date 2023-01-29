import sum from 'lodash/sum'

const beobNichtZuzuordnenFolderNode = ({
  data,
  loading,
  projId,
  apId,
  store,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.beob ?? ''

  const aparts = data?.apById?.beobNichtZuzuordnen?.nodes ?? []
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
    'nicht-zuzuordnende-Beobachtungen',
  ]

  return {
    nodeType: 'folder',
    menuType: 'beobNichtZuzuordnenFolder',
    filterTable: 'beob',
    id: `${apId}BeobNichtZuzuordnenFolder`,
    tableId: apId,
    urlLabel: 'nicht-zuzuordnende-Beobachtungen',
    label: `Beobachtungen nicht zuzuordnen (${message})`,
    url,
    hasChildren: count > 0,
  }
}

export default beobNichtZuzuordnenFolderNode
