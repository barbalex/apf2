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
  const apbers = get(data, 'allApbers.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.apber`,
  )

  const apberNodesLength = apbers
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const jahr = get(el, 'jahr') || '(kein Jahr)'
        return jahr.toString().includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = loading && !apberNodesLength ? '...' : apberNodesLength
  if (nodeLabelFilterString) {
    message = `${apberNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'AP-Berichte']

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'apberFolder',
      filterTable: 'apber',
      id: `${apId}ApberFolder`,
      tableId: apId,
      urlLabel: 'AP-Berichte',
      label: `AP-Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 4],
      hasChildren: apberNodesLength > 0,
    },
  ]
}
