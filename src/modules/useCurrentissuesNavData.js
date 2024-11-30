import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

export const useCurrentissuesNavData = () => {
  const apolloClient = useApolloClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeCurrentissues'],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeCurrentissuesQuery {
            allCurrentissues(orderBy: [SORT_ASC, TITLE_ASC]) {
              totalCount
              nodes {
                id
                label
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      }),
  })

  // subtract 1 for "fehlt hier was"
  const count = (data?.data?.allCurrentissues?.nodes?.length ?? 1) - 1

  const navData = useMemo(
    () => ({
      id: 'AktuelleFehler',
      url: `/Daten/Aktuelle-Fehler`,
      label: `Aktuelle Fehler (${isLoading ? '...' : count})`,
      totalCount: data?.data?.allCurrentissues?.totalCount ?? 0,
      nonFilterable: true,
      menus:
        data?.data?.allCurrentissues?.nodes.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [
      count,
      data?.data?.allCurrentissues?.nodes,
      data?.data?.allCurrentissues?.totalCount,
      isLoading,
    ],
  )

  return { isLoading, error, navData }
}
