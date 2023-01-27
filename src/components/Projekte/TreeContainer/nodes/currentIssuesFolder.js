import max from 'lodash/max'

const currentIssuesFolderNode = ({ data, loading, projektNodes }) => {
  const count = data?.allCurrentissues?.totalCount ?? 0

  // fetch sorting indexes of parents
  const currentIssuesIndex = projektNodes.length + 3

  let message = loading && !count ? '...' : max([count - 1, 0])

  return [
    {
      nodeType: 'folder',
      menuType: 'currentIssuesFolder',
      id: 'currentIssuesFolder',
      urlLabel: 'Aktuelle-Fehler',
      label: `Aktuelle Fehler (${message})`,
      url: ['Aktuelle-Fehler'],
      sort: [currentIssuesIndex],
      hasChildren: count > 0,
    },
  ]
}

export default currentIssuesFolderNode
