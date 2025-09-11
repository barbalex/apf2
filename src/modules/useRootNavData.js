import { useMemo, useEffect, useContext } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'

export const useRootNavData = () => {
  const apolloClient = useApolloClient()
  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeRoot', store.tree.userGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavRootQuery($usersFilter: UserFilter!) {
            allProjekts {
              totalCount
            }
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
          usersFilter: store.tree.userGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.userGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const projectsCount = data?.data?.allProjekts?.totalCount ?? 0
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
          id: 'Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13',
          label: `Projekte (${isLoading ? '...' : projectsCount})`,
        },
        {
          id: 'Benutzer',
          label: `Benutzer (${isLoading ? '...' : `${usersFilteredCount}/${usersCount}`})`,
        },
        {
          id: 'Werte-Listen',
          label: `Werte-Listen`,
        },
        {
          id: 'Mitteilungen',
          label: `Mitteilungen (${isLoading ? '...' : messagesCount})`,
        },
        {
          id: 'Aktuelle-Fehler',
          label: `Aktuelle Fehler (${isLoading ? '...' : currentIssuesCount})`,
        },
      ],
    }),
    [
      isLoading,
      projectsCount,
      usersFilteredCount,
      usersCount,
      messagesCount,
      currentIssuesCount,
    ],
  )

  return { isLoading, error, navData }
}
