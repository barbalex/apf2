import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeUserGqlFilterForTreeAtom } from '../store/index.ts'

export const useUsersNavData = () => {
  const userGqlFilterForTree = useAtomValue(treeUserGqlFilterForTreeAtom)

  const { data } = useSuspenseQuery({
    queryKey: ['treeUser', userGqlFilterForTree],
    queryFn: async () => {
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          '/rpc/query_user?select=id,label',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: userGqlFilterForTree,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount('/q_user'),
      ])
      return {
        allUsers: { nodes: nodes ?? [] },
        totalCount: { totalCount },
      }
    },
  })

  const count = data.allUsers?.nodes.length
  const totalCount = data.totalCount?.totalCount

  const navData = {
    id: 'Benutzer',
    listFilter: 'user',
    url: `/Daten/Benutzer`,
    label: `Benutzer (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'userFolder',
    treeId: 'Benutzer',
    treeTableId: null,
    treeUrl: ['Benutzer'],
    fetcherName: 'useUsersNavData',
    hasChildren: !!count,
    menus: data.allUsers?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'user',
      treeId: p?.id,
      treeTableId: p?.id,
      treeUrl: ['Benutzer', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
