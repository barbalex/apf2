import { graphql } from '../gql'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getEkfrequenzGqlFilterForTree } from './getEkfrequenzGqlFilterForTree.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useEkfrequenzsNavData = (props?: { projId?: string | undefined; apId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = (props?.projId ?? params.projId)!
  const apId = (props?.apId ?? params.apId)!

  // Get filter before useQuery so changes trigger refetch
  const ekfrequenzGqlFilterForTree = getEkfrequenzGqlFilterForTree(apId!)

  const { data } = useSuspenseQuery({
    queryKey: ['treeEkfrequenz', apId, ekfrequenzGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query TreeEkfrequenzsQuery(
            $ekfrequenzsFilter: EkfrequenzFilter!
            $apId: UUID!
          ) {
            apById(id: $apId) {
              id
              ekfrequenzsByApId(filter: $ekfrequenzsFilter, orderBy: SORT_ASC) {
                nodes {
                  id
                  label: code
                }
              }
              totalCount: ekfrequenzsByApId {
                totalCount
              }
            }
          }
        `),
        variables: {
          ekfrequenzsFilter: ekfrequenzGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data!
    },
  })

  const totalCount = data.apById?.totalCount.totalCount
  const rows = data.apById?.ekfrequenzsByApId?.nodes ?? []

  const navData = {
    id: 'EK-Frequenzen',
    listFilter: 'ekfrequenz',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/EK-Frequenzen`,
    label: `EK-Frequenzen (${rows.length}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'ekfrequenzFolder',
    treeId: `${apId}EkfrequenzFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen'],
    hasChildren: !!rows.length,
    component: NodeWithList,
    menus: rows.map((p) => ({
      id: p?.id,
      label: p?.label ?? '(kein Kürzel)',
      treeNodeType: 'table',
      treeMenuType: 'ekfrequenz',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
