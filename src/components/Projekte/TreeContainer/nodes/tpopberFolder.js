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
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
  mobxStore: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.tpopber`) || ''

  const childrenLength = memoizeOne(
    () =>
      get(data, 'allTpopbers.nodes', [])
        .filter(el => el.tpopId === tpopId)
        // filter by nodeLabelFilter
        .filter(el => {
          if (nodeLabelFilterString) {
            return `${el.jahr || '(kein Jahr)'}: ${get(
              el,
              'tpopEntwicklungWerteByEntwicklung.text',
            ) || '(nicht beurteilt)'}`
              .toLowerCase()
              .includes(nodeLabelFilterString.toLowerCase())
          }
          return true
        }).length,
  )()

  let message = loading && !childrenLength ? '...' : childrenLength
  if (nodeLabelFilterString) {
    message = `${childrenLength} gefiltert`
  }

  const url = [
    'Projekte',
    projId,
    'Aktionspläne',
    apId,
    'Populationen',
    popId,
    'Teil-Populationen',
    tpopId,
    'Kontroll-Berichte',
  ]

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(tpopId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopberFolder',
      filterTable: 'tpopber',
      id: `${tpopId}TpopberFolder`,
      tableId: tpopId,
      urlLabel: 'Kontroll-Berichte',
      label: `Kontroll-Berichte (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 5],
      hasChildren: childrenLength > 0,
    },
  ]
}
