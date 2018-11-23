// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import allParentNodesExist from '../allParentNodesExist'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  projId,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const erfkrits = get(data, 'erfkrits.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, {
    id: apId,
  })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.erfkrit`,
  )

  // map through all elements and create array of nodes
  const nodes = erfkrits
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${get(
          el,
          'apErfkritWerteByErfolg.text',
          '(nicht beurteilt)',
        )}: ${el.kriterien || '(keine Kriterien erfasst)'}`.includes(
          nodeLabelFilterString.toLowerCase(),
        )
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'erfkrit',
      filterTable: 'erfkrit',
      id: el.id,
      parentId: el.apId,
      urlLabel: el.id,
      label: `${get(
        el,
        'apErfkritWerteByErfolg.text',
        '(nicht beurteilt)',
      )}: ${el.kriterien || '(keine Kriterien erfasst)'}`,
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        el.apId,
        'AP-Erfolgskriterien',
        el.id,
      ],
      hasChildren: false,
    }))
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    .filter(n => allParentNodesExist(nodesPassed, n))
    // sort by label
    .sort(
      (a, b) =>
        get(b, 'apErfkritWerteByErfolg.sort', 0) -
        get(a, 'apErfkritWerteByErfolg.sort', 0),
    )
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 3, index]
      return el
    })

  return nodes
}
