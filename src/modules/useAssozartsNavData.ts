import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getAssozartGqlFilterForTree } from './getAssozartGqlFilterForTree.ts'

export const useAssozartsNavData = (props?: { projId?: string | undefined; apId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = (props?.projId ?? params.projId ?? '')
  const apId = (props?.apId ?? params.apId ?? '')

  // Get filter before useQuery so changes trigger refetch
  const assozartGqlFilterForTree = getAssozartGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeAssozart', apId, assozartGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query TreeAssozartsQuery(
            $assozartsFilter: AssozartFilter!
            $apId: UUID!
          ) {
            apById(id: $apId) {
              id
              assozartsByApId(filter: $assozartsFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                }
              }
              totalCount: assozartsByApId {
                totalCount
              }
            }
          }
        `),
        variables: {
          assozartsFilter: assozartGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
    },
  })

  const count = data.apById?.assozartsByApId?.nodes?.length ?? 0
  const totalCount = data.apById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'assoziierte-Arten',
    treeTableId: apId,
    listFilter: 'assozart',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/assoziierte-Arten`,
    label: `Assoziierte Arten (${count}/${totalCount})`,
    menus: (data.apById?.assozartsByApId.nodes ?? []).map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'assozart',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
