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
  const bers = get(data, 'bers.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.ber`)

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
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'berFolder',
      filterTable: 'ber',
      id: apId,
      urlLabel: 'Berichte',
      label: `Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 5],
      hasChildren: berNodesLength > 0,
    },
  ]
}
