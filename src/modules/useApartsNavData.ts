import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getApartGqlFilterForTree } from './getApartGqlFilterForTree.ts'

export const useApartsNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const apartGqlFilterForTree = getApartGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeApart', apId, apartGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former apartsByApId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...apartGqlFilterForTree,
        apByApId: {
          ...((apartGqlFilterForTree as { apByApId?: object }).apByApId ?? {}),
          id: { equalTo: apId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_apart?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_apart?ap_id=eq.${apId}`),
      ])
      return {
        apById: {
          id: apId,
          apartsByApId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.apById?.apartsByApId.nodes.length
  const totalCount = data.apById?.totalCount.totalCount

  const navData = {
    id: 'Taxa',
    treeTableId: apId,
    listFilter: 'apart',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Taxa`,
    label: `Taxa (${count}/${totalCount})`,
    menus: data.apById?.apartsByApId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'apart',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'Taxa', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
