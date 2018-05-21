import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

export default ({
  data,
  treeName,
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
  treeName: String,
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
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.beobZugeordnet`)

  const childrenLength = get(data, 'beobZugeordnets.nodes', [])
    .filter(el => el.tpopId === tpopId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.datum || '(kein Datum)'}: ${el.autor || '(kein Autor)'} (${
          el.quelle
        })`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length

  let message = childrenLength
  if (nodeLabelFilterString) {
    message = `${childrenLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'beobZugeordnetFolder',
      id: tpopId,
      urlLabel: 'Beobachtungen',
      label: `Beobachtungen zugeordnet (${message})`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Beobachtungen',
      ],
      sort: [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 6],
      hasChildren: childrenLength > 0,
    },
  ]
}
