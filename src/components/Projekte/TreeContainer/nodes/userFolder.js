// @flow
import get from 'lodash/get'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
}): Array<Object> => {
  const users = get(data, 'users.nodes', [])

  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1
  const nodeLabelFilterString = get(data, `${treeName}.nodeLabelFilter.user`)

  const userNodesLength = users
    // filter by nodeLabelFilter
    .filter(el => {
      if (nodeLabelFilterString) {
        const name = get(el, 'name') || ''
        return name.toLowerCase().includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    }).length
  let message = loading && !userNodesLength ? '...' : userNodesLength
  if (nodeLabelFilterString) {
    message = `${userNodesLength} gefiltert`
  }

  return {
    nodeType: 'folder',
    menuType: 'userFolder',
    filterTable: 'user',
    id: userIndex,
    urlLabel: 'Benutzer',
    label: `Benutzer (${message})`,
    url: ['Benutzer'],
    sort: [userIndex],
    hasChildren: userNodesLength > 0,
  }
}
