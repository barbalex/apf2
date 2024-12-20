import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'

export const useUsersNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeUser', store.tree.userGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
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
        fetchPolicy: 'no-cache',
      }),
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

  const navData = useMemo(
    () => ({
      id: 'Benutzer',
      listFilter: 'user',
      url: `/Daten/Benutzer`,
      label: `Benutzer (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus: (data?.data?.allUsers?.nodes ?? []).map((p) => ({
        id: p.id,
        label: p.label,
      })),
    }),
    [count, data?.data?.allUsers?.nodes, isLoading, totalCount],
  )

  return { isLoading, error, navData }
}
