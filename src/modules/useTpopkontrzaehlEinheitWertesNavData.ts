import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom } from '../store/index.ts'

export const useTpopkontrzaehlEinheitWertesNavData = () => {
  const tpopkontrzaehlEinheitWerteGqlFilterForTree = useAtomValue(
    treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeTpopkontrzaehlEinheitWerte',
      tpopkontrzaehlEinheitWerteGqlFilterForTree,
    ],
    queryFn: async () => {
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          '/rpc/query_tpopkontrzaehl_einheit_werte?select=id,label',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: tpopkontrzaehlEinheitWerteGqlFilterForTree,
              p_order: [
                { field: 'sort', dir: 'asc' },
                { field: 'text', dir: 'asc' },
              ],
            }),
          },
        ),
        apiCount('/q_tpopkontrzaehl_einheit_werte'),
      ])
      return {
        allTpopkontrzaehlEinheitWertes: { nodes: nodes ?? [] },
        totalCount: { totalCount },
      }
    },
  })

  const count = data.allTpopkontrzaehlEinheitWertes?.nodes.length
  const totalCount = data.totalCount?.totalCount

  const navData = {
    id: 'TpopkontrzaehlEinheitWerte',
    listFilter: 'tpopkontrzaehlEinheitWerte',
    url: `/Daten/Werte-Listen/TpopkontrzaehlEinheitWerte`,
    label: `Teil-Population: Zähl-Einheiten (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'TpopkontrzaehlEinheitWerte',
    treeId: `tpopkontrzaehlEinheitWerteFolder`,
    treeTableId: null,
    treeUrl: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
    hasChildren: !!count,
    fetcherName: 'useTpopkontrzaehlEinheitWertesNavData',
    fetcherParams: {},
    menus: data.allTpopkontrzaehlEinheitWertes?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopkontrzaehlEinheitWerte',
      treeId: p?.id,
      treeTableId: p?.id,
      treeUrl: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
