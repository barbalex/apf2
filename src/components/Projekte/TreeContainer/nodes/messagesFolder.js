import { gql } from '@apollo/client'

const messagesFolderNode = async ({ store }) => {
  const { data, loading } = await store.client.query({
    query: gql`
      query TreeMessagesFolderQuery {
        allMessages {
          totalCount
        }
      }
    `,
  })
  const messages = data?.allMessages?.totalCount ?? 0

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
      hasChildren: false,
    },
  ]
}

export default messagesFolderNode
