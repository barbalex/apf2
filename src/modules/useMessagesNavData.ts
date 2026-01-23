import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { Node } from '../components/Projekte/TreeContainer/Tree/Node.tsx'

export const useMessagesNavData = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['treeMessages'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeMessagesQuery {
            allMessages(orderBy: TIME_DESC) {
              totalCount
            }
          }
        `,
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.allMessages?.totalCount ?? 0

  const navData = {
    id: 'Mitteilungen',
    url: `/Daten/Mitteilungen`,
    label: `Mitteilungen (${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'messagesFolder',
    treeId: 'Mitteilungen',
    treeUrl: ['Mitteilungen'],
    fetcherName: 'useMessagesNavData',
    component: Node,
    hasChildren: false,
  }

  return navData
}
