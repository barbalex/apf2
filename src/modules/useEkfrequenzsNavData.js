import { useMemo, useEffect, useContext } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useEkfrequenzsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeEkfrequenz', apId, store.tree.ekfrequenzGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
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
          ekfrequenzsFilter: store.tree.ekfrequenzGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.ekfrequenzGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0
  const rows = useMemo(
    () => data?.data?.apById?.ekfrequenzsByApId?.nodes ?? [],
    [data?.data?.apById?.ekfrequenzsByApId?.nodes],
  )

  const navData = useMemo(
    () => ({
      id: 'EK-Frequenzen',
      listFilter: 'ekfrequenz',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/EK-Frequenzen`,
      label: `EK-Frequenzen (${isLoading ? '...' : `${rows.length}/${totalCount}`})`,
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
    }),
    [apId, isLoading, projId, rows, totalCount],
  )

  return { isLoading, error, navData }
}
