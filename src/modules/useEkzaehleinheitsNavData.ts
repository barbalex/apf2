import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store,
  treeEkzaehleinheitGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useEkzaehleinheitsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const ekzaehleinheitGqlFilterForTree = useAtomValue(
    treeEkzaehleinheitGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: ['treeEkzaehleinheit', apId, ekzaehleinheitGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeEkzaehleinheitsQuery(
            $ekzaehleinheitsFilter: EkzaehleinheitFilter!
            $apId: UUID!
          ) {
            apById(id: $apId) {
              id
              ekzaehleinheitsByApId(
                filter: $ekzaehleinheitsFilter
                orderBy: [SORT_ASC, LABEL_ASC]
              ) {
                nodes {
                  id
                  label
                }
              }
              totalCount: ekzaehleinheitsByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          ekzaehleinheitsFilter: ekzaehleinheitGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const rows = data.apById.ekzaehleinheitsByApId.nodes
  const count = rows.length
  const totalCount = data.apById.totalCount.totalCount

  const navData = {
    id: 'EK-Zähleinheiten',
    listFilter: 'ekzaehleinheit',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten`,
    label: `EK-Zähleinheiten (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'ekzaehleinheitFolder',
    treeId: `${apId}EkzaehleinheitFolder`,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten'],
    hasChildren: !!count,
    component: NodeWithList,
    menus: rows.map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'ekzaehleinheit',
      treeId: p.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
