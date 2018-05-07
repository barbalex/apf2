// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import compareLabel from './compareLabel'

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
  const nodeLabelFilterString = tree.nodeLabelFilter.get('tpopfeldkontr')

  // map through all elements and create array of nodes
  let nodes = get(data, 'tpopfeldkontrs.nodes', [])
    .filter(el => el.tpopId === tpopId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${get(
          el,
          'tpopkontrTypWerteByTyp.text',
          '(kein Typ)'
        )}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map((el, index) => ({
      nodeType: 'table',
      menuType: 'tpopfeldkontr',
      id: el.id,
      parentId: tpopId,
      urlLabel: el.id,
      label: `${el.jahr || '(kein Jahr)'}: ${get(
        el,
        'tpopkontrTypWerteByTyp.text',
        '(kein Typ)'
      )}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Feld-Kontrollen',
        el.id,
      ],
      hasChildren: true,
    }))
  nodes = sortBy(nodes, n => (n.datum ? n.datum : `${n.jahr}-01-01`)).map(
    (el, index) => {
      el.sort = [projIndex, 1, apIndex, 1, popIndex, 1, tpopIndex, 3, index]
      return el
    }
  )

  return nodes
}
