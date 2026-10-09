import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'

export const useProjekteNavData = () => {
  const apolloClient = useApolloClient()

  const { data } = useSuspenseQuery({
    queryKey: ['treeProjects'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query NavProjectsQuery {
            allProjekts {
              nodes {
                id
                name
              }
            }
          }
        `),
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
    },
  })

  const count = data.allProjekts?.nodes.length

  const navData = {
    id: 'projekte',
    url: '/Daten/Projekte',
    label: `Projekte (${count})`,
    menus: data.allProjekts?.nodes.map((p) => ({
      id: p?.id,
      label: p?.name,
    })),
  }

  return navData
}
