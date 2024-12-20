import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export const useIdealbiotopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeIdealbiotop', apId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavIdealbiotopQuery($apId: UUID!) {
            apById(id: $apId) {
              id
              label
              idealbiotopsByApId {
                nodes {
                  id
                  idealbiotopFilesByIdealbiotopId {
                    totalCount
                  }
                }
              }
            }
          }
        `,
        variables: { apId },
        fetchPolicy: 'no-cache',
      }),
  })

  const idealbiotop = data?.data?.apById?.idealbiotopsByApId?.nodes?.[0]
  const filesCount =
    idealbiotop?.idealbiotopFilesByIdealbiotopId?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: apId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Idealbiotop`,
      label: 'Idealbiotop',
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Idealbiotop',
          label: `Idealbiotop`,
        },
        {
          id: 'Dateien',
          label: `Dateien (${filesCount})`,
          count: filesCount,
        },
      ],
    }),
    [filesCount, apId, projId],
  )

  return { isLoading, error, navData }
}
