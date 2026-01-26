import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeUserGqlFilterForTreeAtom } from '../store/index.ts'
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
      return result.data
    },
    suspense: true,
  })

  const count = data.allUsers.nodes.length
  const totalCount = data.totalCount.totalCount

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
    menus: data.allUsers.nodes.map((p) => ({
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
