import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  tree,
  projektNodes,
  apNodes,
  popNodes,
  tpopNodes,
  projId,
  apId,
  popId,
  tpopId,
}: {
  data: Object,
  tree: Object,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const nodeLabelFilterString = tree.nodeLabelFilter.get('tpopmassn')

  const childrenLength = get(data, 'tpopmassns.nodes', [])
    .filter(el => el.tpopId === tpopId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${get(
          el,
          'tpopmassnTypWerteByTyp.text',
          '(kein Typ)'
        )}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length

  let message = childrenLength
  if (tree.nodeLabelFilter.get('tpopmassn')) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'tpopmassnFolder',
      id: tpopId,
      urlLabel: 'Massnahmen',
      label: `Massnahmen (${message})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Massnahmen',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 1],
      hasChildren: childrenLength > 0,
    },
  ]
}
