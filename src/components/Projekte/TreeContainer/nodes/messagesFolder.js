const messagesFolderNode = ({ data, loading, projektNodes }) => {
  const messages = data?.allMessages?.totalCount ?? 0

  // fetch sorting indexes of parents
  const messagesIndex = projektNodes.length + 3

  let message = loading && !messages ? '...' : messages

  return [
    {
      nodeType: 'table',
      menuType: 'message',
      filterTable: 'message',
      id: 'messagesFolder',
      urlLabel: 'Mitteilungen',
      label: `Mitteilungen (${message})`,
      url: ['Mitteilungen'],
      sort: [messagesIndex],
      hasChildren: false,
    },
  ]
}

export default messagesFolderNode
