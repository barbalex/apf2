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
  zielJahr,
  zielId,
  apzieljahrFolderNodes,
  apzielNodes,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array < Object > ,
  projId: String,
  apNodes: Array < Object > ,
  apId: String,
  zielJahr: Number,
  zielId: String,
  apzieljahrFolderNodes: Array < Object > ,
  apzielNodes: Array < Object > ,
}): Array < Object > => {
  const zielbers = get(data, 'zielbers.nodes', [])

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId
  })
  const zieljahrIndex = findIndex(apzieljahrFolderNodes, el => el.jahr === zielJahr)
  const zielIndex = findIndex(apzielNodes, el => el.id === zielId)
  const nodeLabelFilterString = tree.nodeLabelFilter.get('zielber')
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
  let message = zielberNodesLength
  if (tree.nodeLabelFilter.get('zielber')) {
    message = `${zielberNodesLength} gefiltert`
  }

  return [{
    nodeType: 'folder',
    menuType: 'zielberFolder',
    id: zielId,
    urlLabel: 'Berichte',
    label: `Berichte (${message})`,
    url: [
      'Projekte',
      projId,
      'Aktionspläne',
      apId,
      'AP-Ziele',
      zielJahr,
      zielId,
      'Berichte',
    ],
    sort: [projIndex, 1, apIndex, 2, zieljahrIndex, zielIndex, 1],
    hasChildren: zielberNodesLength > 0,
  }, ]
}