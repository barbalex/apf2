import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeUserGqlFilterForTreeAtom } from '../store/index.ts'
import { PasswortFehlt } from '../components/NavElements/PasswortFehlt.tsx'

export const useUsersNavData = () => {
  const userGqlFilterForTree = useAtomValue(treeUserGqlFilterForTreeAtom)

  const { data } = useSuspenseQuery({
    queryKey: ['treeUser', userGqlFilterForTree],
    queryFn: async () => {
      const [nodes, totalCount, passlessUsers] = await Promise.all([
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
        // ids only: the pass column never reaches the client
        apiFetch<{ id: string }[]>('/q_user?pass=is.null&select=id'),
      ])
      return {
        allUsers: { nodes: nodes ?? [] },
        totalCount: { totalCount },
        passlessIds: new Set((passlessUsers ?? []).map((u) => u.id)),
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
      labelRightElements: data.passlessIds.has(p?.id ?? '')
        ? [PasswortFehlt]
        : undefined,
    })),
  }

  return navData
}
