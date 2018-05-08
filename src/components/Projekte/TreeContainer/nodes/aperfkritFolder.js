// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  tree,
  projektNodes,
  projId,
  apNodes,
  apId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array < Object > ,
  projId: String,
  apNodes: Array < Object > ,
  apId: String,
}): Array < Object > => {
  const erfkrits = get(data, 'erfkrits.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('erfkrit')

  const erfkritNodesLength = erfkrits
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${get(
          el,
          'apErfkritWerteByErfolg.text',
          '(nicht beurteilt)'
        )}: ${el.kriterien || '(keine Kriterien erfasst)'}`.includes(
          nodeLabelFilterString.toLowerCase()
        )
      }
      return true
    }).length
  let message = erfkritNodesLength
  if (tree.nodeLabelFilter.get('erfkrit')) {
    message = `${erfkritNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'erfkritFolder',
    id: apId,
    urlLabel: 'AP-Erfolgskriterien',
    label: `AP-Erfolgskriterien (${message})`,
    url: ['Projekte', projId, 'Aktionspläne', apId, 'AP-Erfolgskriterien'],
    sort: [projIndex, 1, apIndex, 3],
    hasChildren: erfkritNodesLength > 0,
  }, ]
}