// @flow
import get from 'lodash/get'

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
  const currentIssues = get(data, 'allCurrentissues.nodes', [])

  // fetch sorting indexes of parents
  const currentIssuesIndex = projektNodes.length + 3

  let message = loading && !currentIssues.length ? '...' : currentIssues.length

  return [
    {
      nodeType: 'folder',
      menuType: 'currentIssuesFolder',
      id: 'currentIssuesFolder',
      urlLabel: 'Aktuelle-Fehler',
      label: `Aktuelle Fehler (${message})`,
      url: ['Aktuelle-Fehler'],
      sort: [currentIssuesIndex],
      hasChildren: currentIssues.length > 0,
    },
  ]
}
