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
    get(mobxStore, `${treeName}.nodeLabelFilter.tpopmassn`) || ''

  let children = memoizeOne(() =>
    get(data, 'allTpopmassns.nodes', [])
      .filter(el => el.tpopId === tpopId)
      // filter by nodeLabelFilter
      .filter(el => {
        if (nodeLabelFilterString) {
          return el.label
            .toLowerCase()
            .includes(nodeLabelFilterString.toLowerCase())
        }
        return true
      }),
  )()

  const childrenLength = children.length

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
    'Massnahmen',
  ]

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(tpopId)) return []

  const nodes = [
    {
      nodeType: 'folder',
      menuType: 'tpopmassnFolder',
      filterTable: 'tpopmassn',
      id: `${tpopId}TpopmassnFolder`,
      tableId: tpopId,
      urlLabel: 'Massnahmen',
      label: `Massnahmen (${message})`,
      url,
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1],
      hasChildren: childrenLength > 0,
    },
  ]
  return nodes
}
