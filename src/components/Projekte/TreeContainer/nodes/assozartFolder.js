// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const assozarts = get(data, 'allAssozarts.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.assozart`,
  )

  const assozartNodesLength = assozarts
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const artname =
          get(el, 'aeEigenschaftenByAeId.artname') || '(keine Art gewählt)'
        return artname
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = loading && !assozartNodesLength ? '...' : assozartNodesLength
  if (nodeLabelFilterString) {
    message = `${assozartNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'assoziierte-Arten']

  // only show if parent node exists
  const apNodesIds = nodesPassed.map(n => n.id)
  if (!apNodesIds.includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'assozartFolder',
      filterTable: 'assozart',
      id: apId,
      urlLabel: 'assoziierte-Arten',
      label: `assoziierte Arten (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 8],
      hasChildren: assozartNodesLength > 0,
    },
  ]
}
