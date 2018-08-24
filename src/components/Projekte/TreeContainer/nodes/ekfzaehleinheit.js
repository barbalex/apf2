// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import allParentNodesAreOpen from '../allParentNodesAreOpen'
import compareLabel from './compareLabel'

export default ({
  data,
  treeName,
  projektNodes,
  apNodes,
  openNodes,
  projId,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  openNodes: Array<String>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const ekfzaehleinheits = get(data, 'ekfzaehleinheits.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(
    data,
    `${treeName}.nodeLabelFilter.ekfzaehleinheit`,
  )

  // map through all elements and create array of nodes
  const nodes = ekfzaehleinheits
    .filter(el => el.apId === apId)
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
    .filter(el => allParentNodesAreOpen(openNodes, el.url))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 9, index]
      return el
    })

  return nodes
}
