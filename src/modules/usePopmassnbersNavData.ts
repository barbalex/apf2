import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getPopmassnberGqlFilterForTree } from './getPopmassnberGqlFilterForTree.ts'

export const usePopmassnbersNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const popmassnberGqlFilterForTree = getPopmassnberGqlFilterForTree(popId)

  const { data } = useSuspenseQuery({
    queryKey: ['treePopmassnber', popId, popmassnberGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former popmassnbersByPopId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...popmassnberGqlFilterForTree,
        popByPopId: {
          ...((popmassnberGqlFilterForTree as { popByPopId?: object })
            .popByPopId ?? {}),
          id: { equalTo: popId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_popmassnber?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_popmassnber?pop_id=eq.${popId}`),
      ])
      return {
        popById: {
          id: popId,
          popmassnbersByPopId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.popById?.popmassnbersByPopId?.nodes?.length ?? 0
  const totalCount = data.popById?.totalCount.totalCount

  const navData = {
    id: 'Massnahmen-Berichte',
    listFilter: 'popmassnber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Massnahmen-Berichte`,
    label: `Massnahmen-Berichte (${count}/${totalCount})`,
    labelShort: `Massn.-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'popmassnberFolder',
    treeId: `${popId}PopmassnberFolder`,
    treeTableId: popId,
    treeParentTableId: popId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Massnahmen-Berichte',
    ],
    hasChildren: count > 0,
    menus: data.popById?.popmassnbersByPopId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'popmassnber',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: popId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Massnahmen-Berichte',
        p?.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
