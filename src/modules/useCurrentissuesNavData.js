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

  const navData = useMemo(
    () => ({
      id: 'AktuelleFehler',
      url: `/Daten/Aktuelle-Fehler`,
      label: `Aktuelle Fehler`,
      totalCount: data?.data?.allCurrentissues?.totalCount ?? 0,
      nonFilterable: true,
      menus:
        data?.data?.allCurrentissues?.nodes.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [
      data?.data?.allCurrentissues?.nodes,
      data?.data?.allCurrentissues?.totalCount,
    ],
  )

  return { isLoading, error, navData }
}
