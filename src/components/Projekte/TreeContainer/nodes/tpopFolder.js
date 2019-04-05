import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.tpop`) || ''

  const children = memoizeOne(() =>
    get(data, 'allTpops.nodes', []).filter(el => el.popId === popId),
  )()

  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${children.length} gefiltert`
    : children.length

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
  ]

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(popId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopFolder',
      filterTable: 'tpop',
      id: `${popId}TpopFolder`,
      tableId: popId,
      parentTableId: popId,
      urlLabel: 'Teil-Populationen',
      label: `Teil-Populationen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1],
      hasChildren: children.length > 0,
    },
  ]
}
