// @flow
import findIndex from 'lodash/findIndex'
import get from 'lodash/get'

import compareLabel from './compareLabel'

export default ({
  data,
  treeName,
  projektNodes,
  apNodes,
  projId,
  apId,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
  apNodes: Array<Object>,
  projId: String,
  apId: String,
}): Array<Object> => {
  const bers = get(data, 'bers.nodes', [])
  // fetch sorting indexes of parents
  const projIndex = findIndex(projektNodes, {
    id: projId,
  })
  const apIndex = findIndex(apNodes, { id: apId })
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.ber`)

  // map through all elements and create array of nodes
  const nodes = bers
    .filter(el => el.apId === apId)
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        return `${el.jahr || '(kein Jahr)'}: ${el.titel || '(kein Titel)'}`
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => ({
      nodeType: 'table',
      menuType: 'ber',
      id: el.id,
      parentId: el.apId,
      urlLabel: el.id,
      label: `${el.jahr || '(kein Jahr)'}: ${el.titel || '(kein Titel)'}`,
      url: ['Projekte', projId, 'Aktionspläne', el.apId, 'Berichte', el.id],
      hasChildren: false,
    }))
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [projIndex, 1, apIndex, 5, index]
      return el
    })

  return nodes
}
