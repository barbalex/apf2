import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeAdresseGqlFilterForTreeAtom } from '../store/index.ts'

export const useAdressesNavData = () => {
  const adresseGqlFilterForTree = useAtomValue(treeAdresseGqlFilterForTreeAtom)

  const { data } = useSuspenseQuery({
    queryKey: ['treeAdresse', adresseGqlFilterForTree],
    queryFn: async () => {
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          '/rpc/query_adresse?select=id,label',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: adresseGqlFilterForTree,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount('/q_adresse'),
      ])
      return {
        allAdresses: { nodes: nodes ?? [] },
        totalCount: { totalCount },
      }
    },
  })

  const count = data.allAdresses?.nodes?.length ?? 0
  const totalCount = data.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Adressen',
    listFilter: 'adresse',
    url: `/Daten/Werte-Listen/Adressen`,
    label: `Adressen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'adresseFolder',
    treeId: `AdresseFolder`,
    treeTableId: null,
    treeUrl: ['Werte-Listen', 'Adressen'],
    hasChildren: !!count,
    fetcherName: 'useAdressesNavData',
    fetcherParams: {},
    menus: data.allAdresses?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'adresse',
      treeId: p?.id,
      treeTableId: p?.id,
      treeUrl: ['Werte-Listen', 'Adressen', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
