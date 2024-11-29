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
            allProjects {
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

  const navData = useMemo(
    () => ({
      id: 'projekte',
      url: '/Daten/Projekte',
      label: `Projekte`,
      totalCount: data?.data?.allProjects?.totalCount ?? 0,
      menus: data?.data?.allProjects?.nodes.map((p) => ({
        id: p.id,
        label: p.name,
      })),
    }),
    [data?.data?.allProjects?.nodes, data?.data?.allProjects?.totalCount],
  )

  return { isLoading, error, navData }
}
