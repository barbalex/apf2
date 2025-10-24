import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useZielNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const jahr = props?.jahr ?? params.jahr
  const zielId = props?.zielId ?? params.zielId

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeZiel', zielId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavZielQuery($zielId: UUID!) {
            zielById(id: $zielId) {
              id
              label
            }
          }
        `,
        variables: { zielId },
        fetchPolicy: 'no-cache',
      }),
  })

  const navData = {
    id: zielId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}/${zielId}`,
    label: data?.data?.zielById?.label ?? '(nicht beschrieben)',
    treeNodeType: 'table',
    treeMenuType: 'ziel',
    treeId: zielId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr, zielId],
    fetcherName: 'useZielNavData',
    fetcherParams: { projId, apId, jahr, zielId },
    hasChildren: false,
    component: NodeWithList,
    menus: [
      {
        id: 'Ziel',
        label: 'Ziel',
        isSelf: true,
      },
    ],
  }

  return { isLoading, error, navData }
}
