import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import { treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom } from '../store/index.ts'

export const useTpopApberrelevantGrundWertesNavData = () => {
  const tpopApberrelevantGrundWerteGqlFilterForTree = useAtomValue(
    treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeTpopApberrelevantGrundWerte',
      tpopApberrelevantGrundWerteGqlFilterForTree,
    ],
    queryFn: async () => {
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          '/rpc/query_tpop_apberrelevant_grund_werte?select=id,label',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: tpopApberrelevantGrundWerteGqlFilterForTree,
              p_order: [
                { field: 'sort', dir: 'asc' },
                { field: 'text', dir: 'asc' },
              ],
            }),
          },
        ),
        apiCount('/q_tpop_apberrelevant_grund_werte'),
      ])
      return {
        allTpopApberrelevantGrundWertes: { nodes: nodes ?? [] },
        totalCount: { totalCount },
      }
    },
  })

  const count = data.allTpopApberrelevantGrundWertes?.nodes.length
  const totalCount = data.totalCount?.totalCount

  const navData = {
    id: 'ApberrelevantGrundWerte',
    listFilter: 'tpopApberrelevantGrundWerte',
    url: `/Daten/Werte-Listen/ApberrelevantGrundWerte`,
    label: `Teil-Population: Grund für AP-Bericht Relevanz (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopApberrelevantGrundWerteFolder',
    treeId: `tpopApberrelevantGrundWerteFolder`,
    treeTableId: null,
    treeUrl: ['Werte-Listen', 'ApberrelevantGrundWerte'],
    hasChildren: !!count,
    fetcherName: 'useTpopApberrelevantGrundWertesNavData',
    fetcherParams: {},
    menus: data.allTpopApberrelevantGrundWertes?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopApberrelevantGrundWerte',
      treeId: p?.id,
      treeTableId: p?.id,
      treeUrl: ['Werte-Listen', 'ApberrelevantGrundWerte', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
