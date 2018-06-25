// @flow
import get from 'lodash/get'

import compareLabel from './compareLabel'

export default ({
  data,
  treeName,
  projektNodes,
}: {
  data: Object,
  treeName: String,
  projektNodes: Array<Object>,
}): Array<Object> => {
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.user`)
  const users = get(data, 'users.nodes', [])

  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1

  // map through all elements and create array of nodes
  const nodes = users
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const name = get(el, 'name') || ''
        return name
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .map(el => {
      const message = el.role ? el.role.replace('apflora_', '') : 'keine Rolle'
      const label = el.name ? `${el.name} (${message})` : '(kein Name)'
      return ({
        nodeType: 'table',
        menuType: 'user',
        id: el.id,
        urlLabel: el.id,
        label,
        url: ['Benutzer', el.id],
        hasChildren: false,
      })
    })
    // sort by label
    .sort(compareLabel)
    .map((el, index) => {
      el.sort = [userIndex, index]
      return el
    })
  return nodes
}
