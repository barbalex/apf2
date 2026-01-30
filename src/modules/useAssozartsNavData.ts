import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getAssozartGqlFilterForTree } from './getAssozartGqlFilterForTree.ts'

export const useAssozartsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  // Get filter before useQuery so changes trigger refetch
  const assozartGqlFilterForTree = getAssozartGqlFilterForTree(apId)

  const { data } = useQuery({
    queryKey: ['treeAssozart', apId, assozartGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
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
        `,
        variables: {
          assozartsFilter: assozartGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const count = data.apById?.assozartsByApId?.nodes?.length ?? 0
  const totalCount = data.apById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'assoziierte-Arten',
    treeTableId: apId,
    listFilter: 'assozart',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/assoziierte-Arten`,
    label: `Assoziierte Arten (${count}/${totalCount})`,
    menus: (data.apById.assozartsByApId.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'assozart',
      treeId: p.id,
      treeTableId: p.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
