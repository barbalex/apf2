import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getPopberGqlFilterForTree } from './getPopberGqlFilterForTree.ts'

export const usePopbersNavData = (
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
  const popberGqlFilterForTree = getPopberGqlFilterForTree(popId)

  const { data } = useSuspenseQuery({
    queryKey: ['treePopber', popId, popberGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former popbersByPopId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...popberGqlFilterForTree,
        popByPopId: {
          ...((popberGqlFilterForTree as { popByPopId?: object }).popByPopId ??
            {}),
          id: { equalTo: popId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_popber?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_popber?pop_id=eq.${popId}`),
      ])
      return {
        popById: {
          id: popId,
          popbersByPopId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.popById?.popbersByPopId.nodes.length
  const totalCount = data.popById?.totalCount.totalCount

  const navData = {
    id: 'Kontroll-Berichte',
    listFilter: 'popber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Kontroll-Berichte`,
    label: `Kontroll-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'popberFolder',
    treeId: `${popId}popberFolder`,
    treeTableId: popId,
    treeParentTableId: popId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Kontroll-Berichte',
    ],
    hasChildren: !!count,
    menus: data.popById?.popbersByPopId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'popber',
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
        'Kontroll-Berichte',
        p?.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
