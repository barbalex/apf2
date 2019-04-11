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
  store,
}) => {
  // return empty if ap is not a real ap and apFilter is set
  const ap = get(data, 'allAps.nodes', []).find(n => n.id === apId)
  const isAp = ap && [1, 2, 3].includes(ap.bearbeitung)
  const apFilter = get(store, `${treeName}.apFilter`)
  if (!!apFilter && !isAp) return []

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.popmassnber`) || ''

  const childrenLength = memoizeOne(
    () =>
      get(data, 'allPopmassnbers.nodes', []).filter(el => el.popId === popId)
        .length,
  )()

  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${childrenLength} gefiltert`
    : childrenLength

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
