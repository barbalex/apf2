// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'
import compareLabel from './compareLabel'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  popNodes,
  tpopNodes,
  tpopfeldkontrNodes,
  projId,
  apId,
  popId,
  tpopId,
  tpopkontrId,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  popNodes: Array<Object>,
  tpopNodes: Array<Object>,
  tpopfeldkontrNodes: Array<Object>,
  projId: String,
  apId: String,
  popId: String,
  tpopId: String,
  tpopkontrId: String,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const popIndex = findIndex(popNodes, { id: popId })
  const tpopIndex = findIndex(tpopNodes, { id: tpopId })
  const tpopkontrIndex = findIndex(tpopfeldkontrNodes, { id: tpopkontrId })
  const nodeLabelFilterString = get(
    data,
    `${treeName}.nodeLabelFilter.tpopkontrzaehl`,
  )

  // map through all elements and create array of nodes
  let nodes = get(data, 'tpopkontrzaehls.nodes', [])
    .filter(el => el.tpopkontrId === tpopkontrId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${get(el, 'tpopkontrzaehlEinheitWerteByEinheit.text') ||
          '(keine Einheit)'}: ${el.anzahl} ${get(
          el,
          'tpopkontrzaehlMethodeWerteByMethode.text',
        ) || '(keine Methode)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'tpopfeldkontrzaehl',
      filterTable: 'tpopkontrzaehl',
      id: el.id,
      parentId: tpopkontrId,
      urlLabel: el.id,
      label: `${get(el, 'tpopkontrzaehlEinheitWerteByEinheit.text') ||
        '(keine Einheit)'}: ${el.anzahl} ${get(
        el,
        'tpopkontrzaehlMethodeWerteByMethode.text',
      ) || '(keine Methode)'}`,
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
        tpopkontrId,
        'Zaehlungen',
        el.id,
      ],
      hasChildren: false,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    .filter(n => allParentNodesExist(nodesPassed, n))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [
        projIndex,
        1,
        apIndex,
        1,
        popIndex,
        1,
        tpopIndex,
        3,
        tpopkontrIndex,
        1,
        index,
      ]
      return el
    })

  return nodes
}
