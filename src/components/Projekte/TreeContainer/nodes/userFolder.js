const userFolderNode = ({ data, loading, projektNodes, store }) => {
  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.user ?? ''

  const count = data?.allUsers?.totalCount ?? 0
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

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
      hasChildren: count > 0,
    },
  ]
}

export default userFolderNode
