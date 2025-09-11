import { useMemo, useEffect, useContext } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useErfkritsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeErfkrit', projId, apId, store.tree.erfkritGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
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
                totalCount
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
          erfkritsFilter: store.tree.erfkritGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.erfkritGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.apById?.erfkritsByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'AP-Erfolgskriterien',
      listFilter: 'erfkrit',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Erfolgskriterien`,
      label: `AP-Erfolgskriterien (${isLoading ? '...' : `${count}/${totalCount}`})`,
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
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'AP-Erfolgskriterien',
          p.id,
        ],
        hasChildren: false,
      })),
    }),
    [
      apId,
      count,
      data?.data?.apById?.erfkritsByApId?.nodes,
      isLoading,
      projId,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
