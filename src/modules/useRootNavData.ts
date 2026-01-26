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
      return result.data
    },
    suspense: true,
  })

  const projectsCount = data.allProjekts.totalCount
  const usersCount = data.allUsers.totalCount
  const usersFilteredCount = data.filteredUsers.totalCount
  const messagesCount = data.allMessages.totalCount
  const currentIssuesCount = data.allCurrentissues.totalCount
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

  return navData
}
