// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  apId: String,
}): Array<Object> => {
  const erfkrits = get(data, 'erfkrits.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.erfkrit`)

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
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'erfkritFolder',
      filterTable: 'erfkrit',
      id: apId,
      urlLabel: 'AP-Erfolgskriterien',
      label: `AP-Erfolgskriterien (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 3],
      hasChildren: erfkritNodesLength > 0,
    },
  ]
}
