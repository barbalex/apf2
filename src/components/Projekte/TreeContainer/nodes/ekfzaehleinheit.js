// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  projektNodes,
  apNodes,
  projId,
  apId,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
  mobxStore: Object,
}): Array<Object> => {
  const ekfzaehleinheits = get(data, 'allEkfzaehleinheits.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(
    mobxStore,
    `${treeName}.nodeLabelFilter.ekfzaehleinheit`,
  )

  // map through all elements and create array of nodes
  const nodes = ekfzaehleinheits
    // only show if parent node exists
    .filter(el =>
      nodesPassed.map(n => n.id).includes(`${el.apId}Ekfzaehleinheit`),
    )
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const zaehleinheit =
          get(el, 'tpopkontrzaehlEinheitWerteByZaehleinheitId.text') ||
          '(keine Zähleinheit gewählt)'
        return zaehleinheit
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'ekfzaehleinheit',
      filterTable: 'ekfzaehleinheit',
      id: el.id,
      parentId: apId,
      urlLabel: el.id,
      label: get(
        el,
        'tpopkontrzaehlEinheitWerteByZaehleinheitId.text',
        '(keine Zähleinheit gewählt)',
      ),
      url: [
        'Projekte',
        projId,
        'Aktionspläne',
        apId,
        'EKF-Zähleinheiten',
        el.id,
      ],
      hasChildren: false,
    }))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 9, index]
      return el
    })

  return nodes
}
