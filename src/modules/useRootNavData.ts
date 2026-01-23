import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeUserGqlFilterForTreeAtom } from '../store/index.ts'

export const useRootNavData = () => {
  const apolloClient = useApolloClient()
  const userGqlFilterForTree = useAtomValue(treeUserGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeRoot', userGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
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
          usersFilter: userGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const projectsCount = data?.data?.allProjekts?.totalCount ?? 0
  const usersCount = data?.data?.allUsers?.totalCount ?? 0
  const usersFilteredCount = data?.data?.filteredUsers?.totalCount ?? 0
  const messagesCount = data?.data?.allMessages?.totalCount ?? 0
  const currentIssuesCount = data?.data?.allCurrentissues?.totalCount ?? 0

  const navData = {
    id: 'Daten',
    url: '/Daten',
    label: `Daten`,
    // leave totalCount undefined as the menus are folders
    menus: [
      {
        id: 'Projekte/e57f56f4-4376-11e8-ab21-4314b6749d13',
        label: `Projekte (${projectsCount})`,
      },
      {
        id: 'Benutzer',
        label: `Benutzer (${usersFilteredCount}/${usersCount})`,
      },
      {
        id: 'Werte-Listen',
        label: `Werte-Listen`,
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
  }

  console.log('Root navData.label:', navData.label)

  return navData
}
