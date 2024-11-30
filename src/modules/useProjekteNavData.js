import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

export const useProjekteNavData = () => {
  const apolloClient = useApolloClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeProjects'],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavProjectsQuery {
            allProjekts {
              totalCount
              nodes {
                id
                name
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      }),
  })

  const count = data?.data?.allProjekts?.nodes?.length ?? 0

  const navData = useMemo(
    () => ({
      id: 'projekte',
      url: '/Daten/Projekte',
      label: `Projekte (${isLoading ? '...' : count})`,
      menus:
        data?.data?.allProjekts?.nodes.map((p) => ({
          id: p.id,
          label: p.name,
        })) ?? [],
    }),
    [count, data?.data?.allProjekts?.nodes, isLoading],
  )

  return { isLoading, error, navData }
}
