import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import { Node } from '../components/Projekte/TreeContainer/Tree/Node.jsx'

export const useMessagesNavData = () => {
  const apolloClient = useApolloClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeMessages'],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeMessagesQuery {
            allMessages(orderBy: TIME_DESC) {
              totalCount
              nodes {
                id
                time
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      }),
  })

  const count = data?.data?.allMessages?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Mitteilungen',
      url: `/Daten/Mitteilungen`,
      label: `Mitteilungen (${isLoading ? '...' : count})`,
      treeNodeType: 'folder',
      treeMenuType: 'messagesFolder',
      treeId: 'Mitteilungen',
      treeUrl: ['Mitteilungen'],
      fetcherName: 'useMessagesNavData',
      component: Node,
      hasChildren: false,
    }),
    [count, isLoading],
  )

  return { isLoading, error, navData }
}
