import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getTpopberGqlFilterForTree } from './getTpopberGqlFilterForTree.ts'

export const useTpopbersNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
        tpopId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''
  const tpopId = props?.tpopId ?? params.tpopId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const tpopberGqlFilterForTree = getTpopberGqlFilterForTree(tpopId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeTpopber', tpopId, tpopberGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former tpopbersByTpopId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...tpopberGqlFilterForTree,
        tpopByTpopId: {
          ...((tpopberGqlFilterForTree as { tpopByTpopId?: object })
            .tpopByTpopId ?? {}),
          id: { equalTo: tpopId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_tpopber?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_tpopber?tpop_id=eq.${tpopId}`),
      ])
      return {
        tpopById: {
          id: tpopId,
          tpopbersByTpopId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.tpopById?.tpopbersByTpopId?.nodes?.length ?? 0
  const totalCount = data.tpopById?.totalCount.totalCount

  const navData = {
    id: 'Kontroll-Berichte',
    listFilter: 'tpopber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Kontroll-Berichte`,
    label: `Kontroll-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    menuType: 'tpopberFolder',
    treeId: `${tpopId}TpopberFolder`,
    treeTableId: tpopId,
    treeParentTableId: tpopId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
      'Kontroll-Berichte',
    ],
    hasChildren: count > 0,
    menus: data.tpopById?.tpopbersByTpopId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopber',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: tpopId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Kontroll-Berichte',
        p?.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
