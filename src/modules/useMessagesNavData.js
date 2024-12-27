import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

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
      component: NodeWithList,
      hasChildren: !!count,
    }),
    [count, isLoading],
  )

  return { isLoading, error, navData }
}
