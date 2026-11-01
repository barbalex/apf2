import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getEkfrequenzGqlFilterForTree } from './getEkfrequenzGqlFilterForTree.ts'

export const useEkfrequenzsNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const ekfrequenzGqlFilterForTree = getEkfrequenzGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeEkfrequenz', apId, ekfrequenzGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former ekfrequenzsByApId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...ekfrequenzGqlFilterForTree,
        apByApId: {
          ...((ekfrequenzGqlFilterForTree as { apByApId?: object }).apByApId ??
            {}),
          id: { equalTo: apId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_ekfrequenz?select=id,label:code`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [{ field: 'sort', dir: 'asc' }],
            }),
          },
        ),
        apiCount(`/q_ekfrequenz?ap_id=eq.${apId}`),
      ])
      return {
        apById: {
          id: apId,
          ekfrequenzsByApId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const totalCount = data.apById?.totalCount.totalCount
  const rows = data.apById?.ekfrequenzsByApId?.nodes ?? []

  const navData = {
    id: 'EK-Frequenzen',
    listFilter: 'ekfrequenz',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/EK-Frequenzen`,
    label: `EK-Frequenzen (${rows.length}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'ekfrequenzFolder',
    treeId: `${apId}EkfrequenzFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen'],
    hasChildren: !!rows.length,
    menus: rows.map((p) => ({
      id: p?.id,
      label: p?.label ?? '(kein Kürzel)',
      treeNodeType: 'table',
      treeMenuType: 'ekfrequenz',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
