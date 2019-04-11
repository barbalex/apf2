// @flow
import get from 'lodash/get'
import memoizeOne from 'memoize-one'

export default ({
  nodes: nodesPassed,
  data,
  treeName,
  loading,
  projektNodes,
  store,
}: {
  nodes: Array<Object>,
  data: Object,
  treeName: String,
  loading: Boolean,
  projektNodes: Array<Object>,
  store: Object,
}): Array<Object> => {
  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1
  const nodeLabelFilterString =
    get(store, `${treeName}.nodeLabelFilter.user`) || ''

  const userNodesLength = memoizeOne(
    () => get(data, 'allUsers.nodes', []).length,
  )()
  const message = loading
    ? '...'
    : !!nodeLabelFilterString
    ? `${userNodesLength} gefiltert`
    : userNodesLength

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
