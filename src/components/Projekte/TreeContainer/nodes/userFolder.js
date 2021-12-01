const userFolderNode = ({ data, treeName, loading, projektNodes, store }) => {
  // fetch sorting indexes of parents
  const userIndex = projektNodes.length + 1
  const nodeLabelFilterString = store?.[treeName]?.nodeLabelFilter?.user ?? ''

  const userNodesLength = (data?.allUsers?.nodes ?? []).length
  const message = loading
    ? '...'
    : nodeLabelFilterString
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

export default userFolderNode
