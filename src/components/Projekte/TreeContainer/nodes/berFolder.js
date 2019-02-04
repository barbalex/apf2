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
  const bers = get(data, 'allBers.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.ber`,
  )

  const berNodesLength = bers
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${el.titel || '(kein Titel)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = loading && !berNodesLength ? '...' : berNodesLength
  if (nodeLabelFilterString) {
    message = `${berNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Berichte']

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'berFolder',
      filterTable: 'ber',
      id: `${apId}Ber`,
      urlLabel: 'Berichte',
      label: `Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 5],
      hasChildren: berNodesLength > 0,
    },
  ]
}
