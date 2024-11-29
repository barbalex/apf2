import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useRootNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(StoreContext)
  const { userGqlFilterForTree } = store.tree

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeRoot', userGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavRootQuery($usersFilter: UserFilter!) {
            allUsers {
              totalCount
            }
            filteredUsers: allUsers(filter: $usersFilter) {
              totalCount
            }
            allMessages {
              totalCount
            }
            allCurrentissues {
              totalCount
            }
          }
        `,
        variables: {
          usersFilter: userGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => userGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const usersCount = data?.data?.allUsers?.totalCount ?? 0
  const usersFilteredCount = data?.data?.filteredUsers?.totalCount ?? 0
  const messagesCount = data?.data?.allMessages?.totalCount ?? 0
  const currentIssuesCount = data?.data?.allCurrentissues?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Daten',
      url: '/Daten',
      label: `Daten`,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Projekte',
          label: `Projekte (1/1)`,
        },
        {
          id: 'Benutzer',
          label: `Benutzer (${usersFilteredCount}/${usersCount})`,
        },
        {
          id: 'Werte-Listen',
          label: `Werte-Listen (4)`,
        },
        {
          id: 'Mitteilungen',
          label: `Mitteilungen (${messagesCount})`,
        },
        {
          id: 'Aktuelle-Fehler',
          label: `Aktuelle Fehler (${currentIssuesCount})`,
        },
      ],
    }),
    [usersFilteredCount, usersCount, messagesCount, currentIssuesCount],
  )

  return { isLoading, error, navData }
}
