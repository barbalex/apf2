import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useEkzaehleinheitsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeEkzaehleinheit',
      apId,
      store.tree.ekzaehleinheitGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
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
          ekzaehleinheitsFilter: store.tree.ekzaehleinheitGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.ekzaehleinheitGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const rows = useMemo(
    () => data?.data?.apById?.ekzaehleinheitsByApId?.nodes ?? [],
    [data],
  )
  const count = rows.length
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'EK-Zähleinheiten',
      listFilter: 'ekzaehleinheit',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten`,
      label: `EK-Zähleinheiten (${isLoading ? '...' : `${count}/${totalCount}`})`,
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
    }),
    [apId, count, isLoading, projId, rows, totalCount],
  )

  return { isLoading, error, navData }
}
