import { graphql } from '../gql'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'

import { Node } from '../components/Projekte/TreeContainer/Tree/Node.tsx'

export const useMessagesNavData = () => {
  const apolloClient = useApolloClient()

  const { data } = useSuspenseQuery({
    queryKey: ['treeMessages'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query TreeMessagesQuery {
            allMessages(orderBy: TIME_DESC) {
              totalCount
            }
          }
        `),
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data!
    },
  })

  const count = data.allMessages?.totalCount

  const navData = {
    id: 'Mitteilungen',
    url: `/Daten/Mitteilungen`,
    label: `Mitteilungen (${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'messagesFolder',
    treeId: 'Mitteilungen',
    treeTableId: null,
    treeUrl: ['Mitteilungen'],
    fetcherName: 'useMessagesNavData',
    component: Node,
    hasChildren: false,
  }

  return navData
}
