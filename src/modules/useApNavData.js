import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export const useApsNavData = ({ apId: apIdPassedIn, projId: projIdPasssedIn }) => {
  const apolloClient = useApolloClient()
  const { apId: apIdFromParams, projId: projIdFromParams } = useParams()
  const apId = apIdPassedIn ?? apIdFromParams
  const projId = projIdPasssedIn ?? projIdFromParams

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeAp', apId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavApQuery($apId: UUID!) {
            apById(id: $apId) {
              id
              label
            }
          }
        `,
        variables: { apId },
        fetchPolicy: 'no-cache',
      }),
  })

  const navData = useMemo(
    () => ({
      id: 'Daten',
      url: '/Daten',
      label: `Daten`,
      totalCount: data?.data?.totalCount?.totalCount ?? 0,
      menus:
        data?.data?.allAps?.nodes.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [data?.data?.allAps?.nodes, data?.data?.totalCount?.totalCount],
  )

  return { isLoading, error, navData }
}
