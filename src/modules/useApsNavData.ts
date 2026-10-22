import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { gql as dynamicGql } from '../apolloGql.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'
import {
  treeApGqlFilterForTreeAtom,
  treeApIdInActiveNodeArrayAtom,
} from '../store/index.ts'

interface TreeActiveApQueryResult {
  allAps?: {
    nodes?: { id: string | null; label: string | null }[] | null
  } | null
}

export const useApsNavData = (props?: { projId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = (props?.projId ?? params.projId ?? '')

  const apGqlFilterForTree = useAtomValue(treeApGqlFilterForTreeAtom)
  const apIdInActiveNodeArray = useAtomValue(treeApIdInActiveNodeArrayAtom)

  const { data } = useSuspenseQuery({
    queryKey: ['treeAp', apGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
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
        `),
        variables: {
          apsFilter: apGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
    },
  })

  // if the active ap was filtered out of the tree list (url was opened
  // directly on it), fetch it separately and add it to the menus.
  // Deliberately NOT part of apGqlFilterForTree: that would change
  // the suspense query key on every ap change, suspending the tree
  // and resetting its scroll position
  const { data: activeApData } = useQuery({
    queryKey: ['treeApActive', apIdInActiveNodeArray],
    enabled: !!apIdInActiveNodeArray,
    queryFn: async () => {
      if (!apIdInActiveNodeArray) return null
      const result = (await apolloClient.query({
        query: dynamicGql`
          query TreeActiveApQuery($id: UUID!) {
            allAps(filter: { id: { equalTo: $id } }) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: { id: apIdInActiveNodeArray },
      })) as { data?: TreeActiveApQueryResult | undefined }
      return result.data ?? null
    },
  })
  const activeAp = activeApData?.allAps?.nodes?.[0] ?? null

  const apMenus = (data.allAps?.nodes ?? [])
    .filter((p) => !!p?.id)
    .map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table' as const,
      treeMenuType: 'ap',
      singleElementName: 'Art',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: projId,
      treeUrl: ['Projekte', projId, 'Arten', p?.id],
      hasChildren: true,
      fetcherName: 'useApNavData',
      fetcherParams: { projId, apId: p?.id },
      component: NodeWithList,
    }))
  // add the active ap if it is not in the list due to filters
  if (activeAp?.id && !apMenus.some((m) => m.id === activeAp.id)) {
    apMenus.push({
      id: activeAp.id,
      label: activeAp.label,
      treeNodeType: 'table' as const,
      treeMenuType: 'ap',
      singleElementName: 'Art',
      treeId: activeAp.id,
      treeTableId: activeAp.id,
      treeParentTableId: projId,
      treeUrl: ['Projekte', projId, 'Arten', activeAp.id],
      hasChildren: true,
      fetcherName: 'useApNavData',
      fetcherParams: { projId, apId: activeAp.id },
      component: NodeWithList,
    })
    apMenus.sort((a, b) =>
      (a.label ?? '').localeCompare(b.label ?? ''),
    )
  }

  const count = apMenus.length
  const totalCount = data.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Arten',
    listFilter: 'ap',
    url: `/Daten/Projekte/${projId}/Arten`,
    label: `Arten (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'apFolder',
    treeId: `${projId}ApFolder`,
    treeTableId: projId,
    treeParentTableId: projId,
    treeUrl: [`Daten`, `Projekte`, projId, `Arten`],
    hasChildren: !!count,
    fetcherName: 'useApsNavData',
    fetcherParams: { projId },
    component: NodeWithList,
    menus: apMenus,
  }

  return navData
}
