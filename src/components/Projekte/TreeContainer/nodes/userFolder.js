import user from './user'

const userFolderNode = async ({
  store,
  treeQueryVariables,
  count,
  isLoading,
}) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.user ?? ''
  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  let children = []
  const isOpen = store.tree.openNodes.some(
    (nodeArray) => nodeArray[0] === 'Benutzer',
  )
  if (isOpen) {
    const userNodes = await user({ store, treeQueryVariables })
    children = userNodes
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'userFolder',
      id: 'benutzerFolder',
      urlLabel: 'Benutzer',
      label: `Benutzer (${message})`,
      url: ['Benutzer'],
      hasChildren: count > 0,
      children,
    },
  ]
}

export default userFolderNode
