import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeUserGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useUsersNavData = () => {
  const apolloClient = useApolloClient()

  const userGqlFilterForTree = useAtomValue(treeUserGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeUser', userGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeUsersQuery($usersFilter: UserFilter!) {
            allUsers(filter: $usersFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            totalCount: allUsers {
              totalCount
            }
          }
        `,
        variables: {
          usersFilter: userGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  // react to filter changes
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)
  useEffect(
    () => {
      const unsub = jotaiStore.sub(treeUserGqlFilterForTreeAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.allUsers?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Benutzer',
    listFilter: 'user',
    url: `/Daten/Benutzer`,
    label: `Benutzer (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'userFolder',
    treeId: 'Benutzer',
    treeUrl: ['Benutzer'],
    fetcherName: 'useUsersNavData',
    hasChildren: !!count,
    component: NodeWithList,
    menus: (data?.data?.allUsers?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'user',
      treeId: p.id,
      treeUrl: ['Benutzer', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
