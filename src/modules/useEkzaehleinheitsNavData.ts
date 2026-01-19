import { useEffect, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useEkzaehleinheitsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, refetch } = useQuery({
    queryKey: [
      'treeEkzaehleinheit',
      apId,
      store.tree.ekzaehleinheitGqlFilterForTree,
    ],
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
          ekzaehleinheitsFilter: store.tree.ekzaehleinheitGqlFilterForTree,
          apId,
        },
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
    () => reaction(() => store.tree.ekzaehleinheitGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const rows = data?.data?.apById?.ekzaehleinheitsByApId?.nodes ?? []
  const count = rows.length
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

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
