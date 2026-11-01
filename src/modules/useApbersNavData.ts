import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getApberGqlFilterForTree } from './getApberGqlFilterForTree.ts'

export const useApbersNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const apberGqlFilterForTree = getApberGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeApber', apId, apberGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former apbersByApId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...apberGqlFilterForTree,
        apByApId: {
          ...((apberGqlFilterForTree as { apByApId?: object }).apByApId ?? {}),
          id: { equalTo: apId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_apber?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_apber?ap_id=eq.${apId}`),
      ])
      return {
        apById: {
          id: apId,
          apbersByApId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.apById?.apbersByApId.nodes.length
  const totalCount = data.apById?.totalCount.totalCount

  const navData = {
    id: 'AP-Berichte',
    treeTableId: apId,
    listFilter: 'apber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Berichte`,
    label: `AP-Berichte (${count}/${totalCount})`,
    menus: data.apById?.apbersByApId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'apber',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Berichte', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
