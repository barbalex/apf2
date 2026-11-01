import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeEkAbrechnungstypWerteGqlFilterForTreeAtom } from '../store/index.ts'

export const useEkAbrechnungstypWertesNavData = () => {
  const ekAbrechnungstypWerteGqlFilterForTree = useAtomValue(
    treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeEkAbrechnungstypWerte',
      ekAbrechnungstypWerteGqlFilterForTree,
    ],
    queryFn: async () => {
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          '/rpc/query_ek_abrechnungstyp_werte?select=id,label',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: ekAbrechnungstypWerteGqlFilterForTree,
              p_order: [
                { field: 'sort', dir: 'asc' },
                { field: 'text', dir: 'asc' },
              ],
            }),
          },
        ),
        apiCount('/q_ek_abrechnungstyp_werte'),
      ])
      return {
        allEkAbrechnungstypWertes: { nodes: nodes ?? [] },
        totalCount: { totalCount },
      }
    },
  })

  const count = data.allEkAbrechnungstypWertes?.nodes.length
  const totalCount = data.totalCount?.totalCount

  const navData = {
    id: 'EkAbrechnungstypWerte',
    listFilter: 'ekAbrechnungstypWerte',
    url: `/Daten/Werte-Listen/EkAbrechnungstypWerte`,
    label: `Teil-Population: EK-Abrechnungstypen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'ekAbrechnungstypWerteFolder',
    treeId: `EkAbrechnungstypWerteFolder`,
    treeTableId: null,
    treeUrl: ['Werte-Listen', 'EkAbrechnungstypWerte'],
    hasChildren: !!count,
    fetcherName: 'useEkAbrechnungstypWertesNavData',
    fetcherParams: {},
    menus: data.allEkAbrechnungstypWertes?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'ekAbrechnungstypWerte',
      treeId: p?.id,
      treeTableId: p?.id,
      treeUrl: ['Werte-Listen', 'EkAbrechnungstypWerte', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
