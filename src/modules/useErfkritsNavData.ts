import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getErfkritGqlFilterForTree } from './getErfkritGqlFilterForTree.ts'

export const useErfkritsNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const erfkritGqlFilterForTree = getErfkritGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeErfkrit', apId, erfkritGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former erfkritsByApId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...erfkritGqlFilterForTree,
        apByApId: {
          ...((erfkritGqlFilterForTree as { apByApId?: object }).apByApId ??
            {}),
          id: { equalTo: apId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_erfkrit?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'apErfkritWerteByErfolg.sort', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_erfkrit?ap_id=eq.${apId}`),
      ])
      return {
        apById: {
          id: apId,
          erfkritsByApId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const count = data.apById?.erfkritsByApId?.nodes?.length ?? 0
  const totalCount = data.apById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'AP-Erfolgskriterien',
    listFilter: 'erfkrit',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Erfolgskriterien`,
    label: `AP-Erfolgskriterien (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'erfkritFolder',
    treeId: `${apId}ErfkritFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien'],
    hasChildren: !!count,
    menus: data.apById?.erfkritsByApId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'erfkrit',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'AP-Erfolgskriterien',
        p?.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
