// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  projId,
  apNodes,
  openNodes,
  apId,
  zielJahr,
  zielId,
  apzieljahrFolderNodes,
  apzielNodes,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  projId: String,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  apId: String,
  zielJahr: Number,
  zielId: String,
  apzieljahrFolderNodes: Array<Object>,
  apzielNodes: Array<Object>,
  mobxStore: Object,
}): Array<Object> => {
  const zielbers = get(data, 'allZielbers.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const zieljahrIndex = findIndex(
    apzieljahrFolderNodes,
    el => el.jahr === zielJahr,
  )
  const zielIndex = findIndex(apzielNodes, el => el.id === zielId)
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.zielber`,
  )
  const zielberNodesLength = zielbers
    .filter(el => el.zielId === zielId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${el.erreichung ||
          '(nicht beurteilt)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = loading && !zielberNodesLength ? '...' : zielberNodesLength
  if (nodeLabelFilterString) {
    message = `${zielberNodesLength} gefiltert`
  }

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'AP-Ziele',
    zielJahr,
    zielId,
    'Berichte',
  ]
  const allParentsOpen = allParentNodesAreOpen(openNodes, url)
  if (!allParentsOpen) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'zielberFolder',
      filterTable: 'zielber',
      id: zielId,
      tableId: zielId,
      urlLabel: 'Berichte',
      label: `Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1],
      hasChildren: zielberNodesLength > 0,
    },
  ].filter(n => allParentNodesExist(nodesPassed, n))
}
