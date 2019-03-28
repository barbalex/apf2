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
  nodeFilter,
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
  nodeFilter: Object,
  mobxStore: Object,
}): Array<Object> => {
  const pops = get(data, 'allPops.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.pop`) || ''

  const popNodesLength = pops
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toString().toLowerCase())
      }
      return true
    }).length
  let message = loading && !popNodesLength ? '...' : popNodesLength
  if (nodeLabelFilterString) {
    message = `${popNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Populationen']

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'popFolder',
      filterTable: 'pop',
      id: `${apId}PopFolder`,
      tableId: apId,
      urlLabel: 'Populationen',
      label: `Populationen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1],
      hasChildren: popNodesLength > 0,
    },
  ]
}
