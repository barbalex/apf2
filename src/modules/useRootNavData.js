import { useMemo, useEffect, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { autorun } from 'mobx'

export const useRootNavData = ({ userGqlFilterForTree }) => {
  const apolloClient = useApolloClient()

  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  const [filter, setFilter] = useState(userGqlFilterForTree)
  useEffect(() => {
    const disposer = autorun(() => {
      setFilter(userGqlFilterForTree)
    })
    return () => disposer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, isLoading, error } = useQuery({
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
          usersFilter: filter,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  const totalCount = 5
  const usersCount = data?.data?.allUsers?.totalCount ?? 0
  const usersFilteredCount = data?.data?.filteredUsers?.totalCount ?? 0
  const messagesCount = data?.data?.allMessages?.totalCount ?? 0
  const currentIssuesCount = data?.data?.allCurrentissues?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Daten',
      url: '/Daten',
      label: `Daten`,
      totalCount,
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
