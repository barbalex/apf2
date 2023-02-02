const messagesFolderNode = async ({ count, isLoading }) => {
  const message = isLoading && !count ? '...' : count

  return {
    nodeType: 'table',
    menuType: 'message',
    id: 'messagesFolder',
    urlLabel: 'Mitteilungen',
    label: `Mitteilungen (${message})`,
    url: ['Mitteilungen'],
    hasChildren: false,
  }
}

export default messagesFolderNode
