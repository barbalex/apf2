import sum from 'lodash/sum'
import findIndex from 'lodash/findIndex'

const beobNichtBeurteiltFolderNode = ({
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
  const aparts = (data?.openAps?.nodes ?? []).find((el) => el?.id === apId)
    ?.beobNichtBeurteilt?.nodes
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

  // only show if parent node exists
  const apNodesIds = nodesPassed.map((n) => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'beobNichtBeurteiltFolder',
      filterTable: 'beob',
      id: `${apId}BeobNichtBeurteiltFolder`,
      tableId: apId,
      urlLabel: 'nicht-beurteilte-Beobachtungen',
      label: `Beobachtungen nicht beurteilt (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 11],
      hasChildren: count > 0,
    },
  ]
}

export default beobNichtBeurteiltFolderNode
