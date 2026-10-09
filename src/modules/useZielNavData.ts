import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useZielNavData = (props?: { projId?: string | undefined; apId?: string | undefined; jahr?: string | undefined; zielId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = (props?.projId ?? params.projId ?? '')
  const apId = (props?.apId ?? params.apId ?? '')
  const jahr = (props?.jahr ?? params.jahr ?? '')
  const zielId = (props?.zielId ?? params.zielId ?? '')

  const { data } = useSuspenseQuery({
    queryKey: ['treeZiel', zielId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query NavZielQuery($zielId: UUID!) {
            zielById(id: $zielId) {
              id
              label
            }
          }
        `),
        variables: { zielId },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
    },
  })

  const navData = {
    id: zielId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}/${zielId}`,
    label: data.zielById?.label ?? '(nicht beschrieben)',
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
