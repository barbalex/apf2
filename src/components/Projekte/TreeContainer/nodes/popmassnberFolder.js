import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

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
  // return empty if ap is not a real ap and apFilter is set
  const ap = get(data, 'allAps.nodes', []).find(n => n.id === apId)
  const isAp = ap && [1, 2, 3].includes(ap.bearbeitung)
  const apFilter = get(mobxStore, `${treeName}.apFilter`)
  if (!!apFilter && !isAp) return []

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.popmassnber`,
  )

  const childrenLength = get(data, 'allPopmassnbers.nodes', [])
    .filter(el => el.popId === popId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${get(
          el,
          'tpopmassnErfbeurtWerteByBeurteilung.text',
        ) || '(nicht beurteilt)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length

  let message = loading && !childrenLength ? '...' : childrenLength
  if (nodeLabelFilterString) {
    message = `${childrenLength} gefiltert`
  }

  // only show if parent node exists
  if (!nodesPassed.map(n => n.id).includes(popId)) return []

  return [
    {
      nodeType: 'folder',
      menuType: 'popmassnberFolder',
      filterTable: 'popmassnber',
      id: `${popId}PopmassnberFolder`,
      tableId: popId,
      urlLabel: 'Massnahmen-Berichte',
      label: `Massnahmen-Berichte (${message})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Massnahmen-Berichte',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 3],
      hasChildren: childrenLength > 0,
    },
  ]
}
