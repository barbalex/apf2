import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { treeApberuebersichtGqlFilterForTreeAtom } from '../store/index.ts'

export const useApberuebersichtsNavData = (
  props?: { projId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params?.projId

  const apberuebersichtGqlFilterForTree = useAtomValue(
    treeApberuebersichtGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: ['treeApberuebersicht', apberuebersichtGqlFilterForTree],
    queryFn: async () => {
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          '/rpc/query_apberuebersicht?select=id,label',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: apberuebersichtGqlFilterForTree,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount('/q_apberuebersicht'),
      ])
      return {
        filtered: { nodes: nodes ?? [] },
        unfiltered: { totalCount },
      }
    },
  })

  const count = data.filtered?.nodes.length
  const totalCount = data.unfiltered?.totalCount

  const navData = {
    id: 'AP-Berichte',
    listFilter: 'apberuebersicht',
    url: `/Daten/Projekte/${projId}/AP-Berichte`,
    label: 'AP-Berichte ' + `${count}/${totalCount}`,
    treeNodeType: 'folder',
    treeMenuType: 'apberuebersichtFolder',
    treeId: `${projId}/ApberuebersichtFolder`,
    treeTableId: projId,
    treeParentTableId: projId,
    treeUrl: ['Projekte', projId, 'AP-Berichte'],
    hasChildren: !!count,
    fetcherName: 'useApberuebersichtsNavData',
    fetcherParams: { projId },
    menus: data.filtered?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'apberuebersicht',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: projId,
      treeUrl: ['Projekte', projId, 'AP-Berichte', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
