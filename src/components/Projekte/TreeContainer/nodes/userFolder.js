// @flow
import get from 'lodash/get'

export default ({
  data,
  treeName,
  loading,
  projektNodes,
}: {
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
        return get(el, 'name', '')
          .toLowerCase()
          .includes(nodeLabelFilterString.toLowerCase())
      }
      return true
    })
    .length
  let message = (loading && !userNodesLength) ? '...' : userNodesLength
  if (nodeLabelFilterString) {
    message = `${userNodesLength} gefiltert`
  }

  return ({
    nodeType: 'folder',
    menuType: 'userFolder',
    id: userIndex,
    urlLabel: 'Benutzer',
    label: `Benutzer (${message})`,
    url: ['Benutzer'],
    sort: [userIndex],
    hasChildren: userNodesLength > 0,
  })
}
