import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useUsersNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeUsers', store.tree.userGqlFilterForTree],
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

  const navData = useMemo(
    () => ({
      id: 'Benutzer',
      url: `/Daten/Benutzer`,
      label: `Benutzer`,
      totalCount: data?.data?.totalCount?.totalCount ?? 0,
      menus:
        data?.data?.allUsers?.nodes.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [data?.data?.allUsers?.nodes, data?.data?.totalCount?.totalCount],
  )

  return { isLoading, error, navData }
}
