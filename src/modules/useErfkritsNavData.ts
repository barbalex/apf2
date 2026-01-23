import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { store, treeErfkritGqlFilterForTreeAtom } from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useErfkritsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const erfkritGqlFilterForTree = useAtomValue(treeErfkritGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeErfkrit', apId, erfkritGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeErfkritsQuery(
            $erfkritsFilter: ErfkritFilter!
            $apId: UUID!
          ) {
            apById(id: $apId) {
              id
              erfkritsByApId(
                filter: $erfkritsFilter
                orderBy: AP_ERFKRIT_WERTE_BY_ERFOLG__SORT_ASC
              ) {
                nodes {
                  id
                  label
                }
              }
              totalCount: erfkritsByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          erfkritsFilter: erfkritGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.apById?.erfkritsByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'AP-Erfolgskriterien',
    listFilter: 'erfkrit',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Erfolgskriterien`,
    label: `AP-Erfolgskriterien (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'erfkritFolder',
    treeId: `${apId}ErfkritFolder`,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien'],
    hasChildren: !!count,
    component: NodeWithList,
    menus: (data?.data?.apById?.erfkritsByApId?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'erfkrit',
      treeId: p.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
