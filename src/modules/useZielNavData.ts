import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useZielNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const jahr = props?.jahr ?? params.jahr
  const zielId = props?.zielId ?? params.zielId

  const { data } = useQuery({
    queryKey: ['treeZiel', zielId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavZielQuery($zielId: UUID!) {
            zielById(id: $zielId) {
              id
              label
            }
          }
        `,
        variables: { zielId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const navData = {
    id: zielId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}/${zielId}`,
    label: data.zielById.label ?? '(nicht beschrieben)',
    treeNodeType: 'table',
    treeMenuType: 'ziel',
    treeId: zielId,
    treeTableId: zielId,
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

  return navData
}
