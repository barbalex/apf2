import { apiCount, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeUserGqlFilterForTreeAtom } from '../store/index.ts'

export const useRootNavData = () => {
  const userGqlFilterForTree = useAtomValue(treeUserGqlFilterForTreeAtom)

  const { data } = useSuspenseQuery({
    queryKey: ['treeRoot', userGqlFilterForTree],
    queryFn: async () => {
      const [
        projectsCount,
        usersCount,
        usersFilteredCount,
        messagesCount,
        currentIssuesCount,
      ] = await Promise.all([
        apiCount('/projekt'),
        apiCount('/q_user'),
        rpcCount('query_user', { p_filter: userGqlFilterForTree }),
        apiCount('/message'),
        apiCount('/currentissue'),
      ])
      return {
        allProjekts: { totalCount: projectsCount },
        allUsers: { totalCount: usersCount },
        filteredUsers: { totalCount: usersFilteredCount },
        allMessages: { totalCount: messagesCount },
        allCurrentissues: { totalCount: currentIssuesCount },
      }
    },
  })

  const projectsCount = data.allProjekts?.totalCount
  const usersCount = data.allUsers?.totalCount
  const usersFilteredCount = data.filteredUsers?.totalCount
  const messagesCount = data.allMessages?.totalCount
  const currentIssuesCount = data.allCurrentissues?.totalCount
  const navData = {
    id: 'Daten',
    url: '/Daten',
    label: `Daten`,
    // leave totalCount undefined as the menus are folders
    menus: [
      {
        id: 'Projekte/017d3474-6b07-7c56-86ef-84b0af1de903',
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
