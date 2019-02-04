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
  const erfkrits = get(data, 'allErfkrits.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.erfkrit`,
  )

  const erfkritNodesLength = erfkrits
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${get(
          el,
          'apErfkritWerteByErfolg.text',
          '(nicht beurteilt)',
        )}: ${el.kriterien || '(keine Kriterien erfasst)'}`.includes(
          nodeLabelFilterString.toLowerCase(),
        )
      }
      return true
    }).length
  let message = loading && !erfkritNodesLength ? '...' : erfkritNodesLength
  if (nodeLabelFilterString) {
    message = `${erfkritNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien']

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(apId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'erfkritFolder',
      filterTable: 'erfkrit',
      id: `${apId}Erfkrit`,
      urlLabel: 'AP-Erfolgskriterien',
      label: `AP-Erfolgskriterien (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 3],
      hasChildren: erfkritNodesLength > 0,
    },
  ]
}
