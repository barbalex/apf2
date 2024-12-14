import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

export const useTpopmassnNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopmassnId = props?.tpopmassnId ?? params.tpopmassnId

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeTpopmassn', tpopmassnId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavTpopmassnQuery($tpopmassnId: UUID!) {
            tpopmassnById(id: $tpopmassnId) {
              id
              label
              tpopmassnFilesByTpopmassnId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopmassnId,
        },
        fetchPolicy: 'no-cache',
      }),
  })

  const label = data?.data?.tpopmassnById?.label
  data?.data?.tpopmassnById?.filteredBeobZugeordnet?.totalCount ?? 0
  const filesCount =
    data?.data?.tpopmassnById?.tpopmassnFilesByTpopmassnId?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: tpopmassnId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen/${tpopmassnId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Massnahme',
          label: `Massnahme`,
        },
        {
          id: 'Dateien',
          label: `Dateien (${filesCount})`,
          count: filesCount,
        },
      ],
    }),
    [apId, filesCount, label, popId, projId, tpopId, tpopmassnId],
  )

  return { isLoading, error, navData }
}
