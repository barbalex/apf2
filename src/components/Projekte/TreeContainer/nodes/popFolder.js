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
  const pops = get(data, 'pops.nodes', [])
  const apFilter = get(data, `${treeName}.apFilter`)

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.pop`)

  const popNodesLength = pops
    .filter(el => el.apId === apId)
    // return empty if ap is not a real ap and apFilter is set
    .filter(el => {
      const isAp = [1, 2, 3].includes(get(el, 'apByApId.bearbeitung'))
      return !(apFilter && !isAp)
    })
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.nr || '(keine Nr)'}: ${el.name || '(kein Name)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = (loading && !popNodesLength) ? '...' : popNodesLength
  if (nodeLabelFilterString) {
    message = `${popNodesLength} gefiltert`
  }

  const url = ['Projekte', projId, 'Aktionspläne', apId, 'Populationen']
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [({
    nodeType: 'folder',
    menuType: 'popFolder',
    id: apId,
    urlLabel: 'Populationen',
    label: `Populationen (${message})`,
    url,
    sort: [projIndex, 1, apIndex, 1],
    hasChildren: popNodesLength > 0,
  })]
}