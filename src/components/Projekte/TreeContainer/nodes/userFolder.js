// @flow
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  mobxStore,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  mobxStore: Object,
}): Array<Object> => {
  const users = get(data, 'allUsers.nodes', [])

  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1
  const nodeLabelFilterString =
    get(mobxStore, `${treeName}.nodeLabelFilter.user`) || ''

  const userNodesLength = memoizeOne(
    () =>
      users
        // filter by nodeLabelFilter
        .filter(el => {
          if (nodeLabelFilterString) {
            return el.label
              .toLowerCase()
              .includes(nodeLabelFilterString.toLowerCase())
          }
          return true
        }).length,
  )()
  let message = loading && !userNodesLength ? '...' : userNodesLength
  if (nodeLabelFilterString) {
    message = `${userNodesLength} gefiltert`
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'userFolder',
      filterTable: 'user',
      id: 'benutzerFolder',
      urlLabel: 'Benutzer',
      label: `Benutzer (${message})`,
      url: ['Benutzer'],
      sort: [userIndex],
      hasChildren: userNodesLength > 0,
    },
  ]
}
