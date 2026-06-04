import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

export const useProjekteNavData = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['treeProjects'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavProjectsQuery {
            allProjekts {
              nodes {
                id
                name
              }
            }
          }
        `,
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const count = data.allProjekts.nodes.length

  const navData = {
    id: 'projekte',
    url: '/Daten/Projekte',
    label: `Projekte (${count})`,
    menus: data.allProjekts.nodes.map((p) => ({
      id: p.id,
      label: p.name,
    })),
  }

  return navData
}
