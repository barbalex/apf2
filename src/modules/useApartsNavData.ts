import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getApartGqlFilterForTree } from './getApartGqlFilterForTree.ts'

export const useApartsNavData = (props?: { projId?: string | undefined; apId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = (props?.projId ?? params.projId ?? '')
  const apId = (props?.apId ?? params.apId ?? '')

  // Get filter before useQuery so changes trigger refetch
  const apartGqlFilterForTree = getApartGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeApart', apId, apartGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query TreeApartsQuery($apartsFilter: ApartFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              apartsByApId(filter: $apartsFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                }
              }
              totalCount: apartsByApId {
                totalCount
              }
            }
          }
        `),
        variables: {
          apartsFilter: apartGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
    },
  })

  const count = data.apById?.apartsByApId.nodes.length
  const totalCount = data.apById?.totalCount.totalCount

  const navData = {
    id: 'Taxa',
    treeTableId: apId,
    listFilter: 'apart',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Taxa`,
    label: `Taxa (${count}/${totalCount})`,
    menus: data.apById?.apartsByApId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'apart',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'Taxa', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
