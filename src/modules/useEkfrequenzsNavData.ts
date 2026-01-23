import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeEkfrequenzGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useEkfrequenzsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const ekfrequenzGqlFilterForTree = useAtomValue(
    treeEkfrequenzGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: ['treeEkfrequenz', apId, ekfrequenzGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
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
        `,
        variables: {
          ekfrequenzsFilter: ekfrequenzGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0
  const rows = data?.data?.apById?.ekfrequenzsByApId?.nodes ?? []

  const navData = {
    id: 'EK-Frequenzen',
    listFilter: 'ekfrequenz',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/EK-Frequenzen`,
    label: `EK-Frequenzen (${rows.length}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'ekfrequenzFolder',
    treeId: `${apId}EkfrequenzFolder`,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen'],
    hasChildren: !!rows.length,
    component: NodeWithList,
    menus: rows.map((p) => ({
      id: p.id,
      label: p.label ?? '(kein Kürzel)',
      treeNodeType: 'table',
      treeMenuType: 'ekfrequenz',
      treeId: p.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
