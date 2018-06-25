import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
  apNodes,
  popNodes,
  projId,
  apId,
  popId,
}: {
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
}): Array<Object> => {
  // return empty if ap is not a real ap and apFilter is set
  const ap = get(data, 'aps.nodes', []).filter(n => n.id === apId)
  const isAp = [1, 2, 3].includes(ap.bearbeitung)
  const apFilter = get(data, `${treeName}.apFilter`)
  if (!!apFilter && !isAp) return []

  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.popber`)

  const childrenLength = get(data, 'popbers.nodes', [])
    .filter(el => el.popId === popId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${get(
          el, 'tpopEntwicklungWerteByEntwicklung.text'
        ) || '(nicht beurteilt)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length

  let message = (loading && !childrenLength) ? '...' : childrenLength
  if (nodeLabelFilterString) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'popberFolder',
      id: popId,
      urlLabel: 'Kontroll-Berichte',
      label: `Kontroll-Berichte (${message})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 2],
      hasChildren: childrenLength > 0,
    },
  ]
}
