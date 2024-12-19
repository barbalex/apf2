import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

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

  const navData = useMemo(
    () => ({
      id: 'Mitteilungen',
      url: `/Daten/Mitteilungen`,
      label: `Mitteilungen (${isLoading ? '...' : data?.data?.allMessages?.totalCount})`,
      isFilterable: false,
      // leave menus undefined as there are none
    }),
    [data?.data?.allMessages?.totalCount, isLoading],
  )

  return { isLoading, error, navData }
}
