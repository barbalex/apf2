import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getTpopmassnberGqlFilterForTree } from './getTpopmassnberGqlFilterForTree.ts'

export const useTpopmassnbersNavData = (
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
  const tpopmassnberGqlFilterForTree = getTpopmassnberGqlFilterForTree(tpopId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeTpopmassnber', tpopId, tpopmassnberGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former tpopmassnbersByTpopId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...tpopmassnberGqlFilterForTree,
        tpopByTpopId: {
          ...((tpopmassnberGqlFilterForTree as { tpopByTpopId?: object })
            .tpopByTpopId ?? {}),
          id: { equalTo: tpopId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_tpopmassnber?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_tpopmassnber?tpop_id=eq.${tpopId}`),
      ])
      return {
        tpopById: {
          id: tpopId,
          tpopmassnbersByTpopId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.tpopById?.tpopmassnbersByTpopId.nodes.length
  const totalCount = data.tpopById?.totalCount.totalCount

  const navData = {
    id: 'Massnahmen-Berichte',
    listFilter: 'tpopmassnber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen-Berichte`,
    label: `Massnahmen-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopmassnberFolder',
    treeId: `${tpopId}TpopmassnberFolder`,
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
      'Massnahmen-Berichte',
    ],
    hasChildren: !!count,
    menus: data.tpopById?.tpopmassnbersByTpopId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopmassnber',
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
        'Massnahmen-Berichte',
        p?.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
