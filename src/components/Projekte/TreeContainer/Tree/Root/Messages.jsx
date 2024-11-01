import { Row } from '../Row.jsx'

export const MessagesFolder = ({ count, isLoading }) => {
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

  return <Row node={node} />
}
