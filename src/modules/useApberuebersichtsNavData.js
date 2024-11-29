import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export const useApberuebersichtsNavData = ({
  projId: projIdPassedIn,
  apberuebersichtGqlFilterForTree,
}) => {
  const apolloClient = useApolloClient()

  const { projId: projIdFromParams } = useParams()
  const projId = projIdPassedIn ?? projIdFromParams

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeApberuebersichts', projId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavApberuebersichtsQuery(
            $projId: UUID!
            $apberuebersichtFilter: ApberuebersichtFilter!
          ) {
            projektById(id: $projId) {
              id
              apberuebersichtsByProjId(filter: $apberuebersichtFilter) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              allApberuebersichts: apberuebersichtsByProjId {
                totalCount
              }
            }
          }
        `,
        variables: {
          projId,
          apberuebersichtFilter: apberuebersichtGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const navData = useMemo(
    () => ({
      id: 'projekte',
      url: `/Daten/Projekte/${projId}/AP-Berichte`,
      label: 'AP-Berichte',
      totalCount: data?.data?.projektById?.allApberuebersichts?.totalCount ?? 0,
      menus:
        data?.data?.projektById?.apberuebersichtsByProjId?.nodes.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [
      data?.data?.projektById?.allApberuebersichts?.totalCount,
      data?.data?.projektById?.apberuebersichtsByProjId?.nodes,
      projId,
    ],
  )

  return { isLoading, error, navData }
}
