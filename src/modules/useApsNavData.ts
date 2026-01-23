import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'
import {
  store,
  treeApGqlFilterForTreeAtom,
} from '../store/index.ts'

export const useApsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId

  const apGqlFilterForTree = useAtomValue(treeApGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeAp', apGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeApsQuery($apsFilter: ApFilter!) {
            allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            totalCount: allAps {
              totalCount
            }
          }
        `,
        variables: {
          apsFilter: apGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.allAps?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Arten',
    listFilter: 'ap',
    url: `/Daten/Projekte/${projId}/Arten`,
    label: `Arten (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'apFolder',
    treeId: `${projId}ApFolder`,
    treeParentTableId: projId,
    treeUrl: [`Daten`, `Projekte`, projId, `Arten`],
    hasChildren: !!count,
    fetcherName: 'useApsNavData',
    fetcherParams: { projId },
    component: NodeWithList,
    menus: (data?.data?.allAps?.nodes ?? [])?.map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'ap',
      singleElementName: 'Art',
      treeId: p.id,
      treeParentTableId: projId,
      treeUrl: ['Projekte', projId, 'Arten', p.id],
      hasChildren: true,
      fetcherName: 'useApNavData',
      fetcherParams: { projId, apId: p.id },
      component: NodeWithList,
    })),
  }

  return navData
}
