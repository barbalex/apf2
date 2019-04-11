import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

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
  store,
}) => {
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
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.zielber`) || ''
  const zielberNodesLength = memoizeOne(
    () =>
      get(data, 'allZielbers.nodes', []).filter(el => el.zielId === zielId)
        .length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${zielberNodesLength} gefiltert`
    : zielberNodesLength

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
