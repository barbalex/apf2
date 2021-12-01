import max from 'lodash/max'

const currentIssuesFolderNode = ({ data, loading, projektNodes }) => {
  const currentIssues = data?.allCurrentissues?.nodes ?? []

  // fetch sorting indexes of parents
  const currentIssuesIndex = projektNodes.length + 3

  let message =
    loading && !currentIssues.length
      ? '...'
      : max([currentIssues.length - 1, 0])

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

export default currentIssuesFolderNode
