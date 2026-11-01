import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getAssozartGqlFilterForTree } from './getAssozartGqlFilterForTree.ts'

export const useAssozartsNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const assozartGqlFilterForTree = getAssozartGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeAssozart', apId, assozartGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former assozartsByApId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...assozartGqlFilterForTree,
        apByApId: {
          ...((assozartGqlFilterForTree as { apByApId?: object }).apByApId ??
            {}),
          id: { equalTo: apId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_assozart?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_assozart?ap_id=eq.${apId}`),
      ])
      return {
        apById: {
          id: apId,
          assozartsByApId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.apById?.assozartsByApId?.nodes?.length ?? 0
  const totalCount = data.apById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'assoziierte-Arten',
    treeTableId: apId,
    listFilter: 'assozart',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/assoziierte-Arten`,
    label: `Assoziierte Arten (${count}/${totalCount})`,
    menus: (data.apById?.assozartsByApId.nodes ?? []).map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'assozart',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
