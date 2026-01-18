import { useEffect, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useApsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId

  const store = useContext(MobxContext)

  const { data, refetch } = useQuery({
    queryKey: ['treeAp', projId, store.tree.apGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeApsQuery($apsFilter: ApFilter!, $projId: UUID!) {
            allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            totalCount: allAps(filter: { projId: { equalTo: $projId } }) {
              totalCount
            }
          }
        `,
        variables: {
          apsFilter: store.tree.apGqlFilterForTree,
          projId,
        },
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.apGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

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

  return { navData }
}
