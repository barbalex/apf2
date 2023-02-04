import Row from '../Row'

const MessagesNode = ({ count, isLoading }) => {
  const message = isLoading && !count ? '...' : count

  const node = {
    nodeType: 'table',
    menuType: 'message',
    id: 'messagesFolder',
    urlLabel: 'Mitteilungen',
    label: `Mitteilungen (${message})`,
    url: ['Mitteilungen'],
    hasChildren: false,
  }

  return <Row key={node.id} node={node} />
}

export default MessagesNode
