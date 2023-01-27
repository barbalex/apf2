import findIndex from 'lodash/findIndex'

const beobNichtZuzuordnenFolderNode = ({
  nodes: nodesPassed,
  data,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  store,
}) => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.beob ?? ''

  const beobNichtZuzuordnenNodesLength = (
    data?.apBeobsNichtZuzuordnen?.nodes ?? []
  ).filter((el) =>
    el?.aeTaxonomyByArtId?.apartsByArtId?.nodes?.some(
      (el) => el?.apId === apId,
    ),
  ).length
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${beobNichtZuzuordnenNodesLength} gefiltert`
    : beobNichtZuzuordnenNodesLength

  const url = [
    'Projekte',
    projId,
    'Arten',
    apId,
    'nicht-zuzuordnende-Beobachtungen',
  ]

  // only show if parent node exists
  const apNodesIds = nodesPassed.map((n) => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'beobNichtZuzuordnenFolder',
      filterTable: 'beob',
      id: `${apId}BeobNichtZuzuordnenFolder`,
      tableId: apId,
      urlLabel: 'nicht-zuzuordnende-Beobachtungen',
      label: `Beobachtungen nicht zuzuordnen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 12],
      hasChildren: beobNichtZuzuordnenNodesLength > 0,
    },
  ]
}

export default beobNichtZuzuordnenFolderNode
