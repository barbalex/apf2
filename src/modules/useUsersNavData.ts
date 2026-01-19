import { useEffect, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useUsersNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)

  const { data, refetch } = useQuery({
    queryKey: ['treeUser', store.tree.userGqlFilterForTree],
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
          usersFilter: store.tree.userGqlFilterForTree,
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
    () => reaction(() => store.tree.userGqlFilterForTree, refetch),
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
