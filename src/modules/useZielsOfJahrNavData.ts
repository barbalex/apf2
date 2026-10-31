import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getZielGqlFilterForTree } from './getZielGqlFilterForTree.ts'

export const useZielsOfJahrNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        jahr?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const jahrParam = props?.jahr ?? params.jahr
  const jahr = jahrParam ? +jahrParam : undefined

  // Get filter before useQuery so changes trigger refetch
  const zielGqlFilterForTree = getZielGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeZielsOfJahr', apId, jahr, zielGqlFilterForTree],
    queryFn: async () => {
      const filter = {
        ...zielGqlFilterForTree,
        apByApId: {
          ...((zielGqlFilterForTree as { apByApId?: object }).apByApId ?? {}),
          id: { equalTo: apId },
        },
        jahr: { equalTo: jahr },
      }
      const [filteredZiels, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null; jahr: number | null }[]>(
          `/rpc/query_ziel?select=id,label,jahr`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [
                { field: 'jahr', dir: 'asc' },
                { field: 'label', dir: 'asc' },
              ],
            }),
          },
        ),
        apiCount(`/q_ziel?ap_id=eq.${apId}&jahr=eq.${jahr}`),
      ])
      return {
        apById: {
          id: apId,
          zielsByApId: { totalCount },
          filteredZiels: { nodes: filteredZiels ?? [] },
        },
      }
    },
  })

  const count = data.apById?.zielsByApId.totalCount
  const filteredZiels = data.apById?.filteredZiels?.nodes ?? []

  const navData = {
    id: jahr,
    listFilter: 'ziel',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}`,
    label: `Ziele für ${jahr} (${filteredZiels.length}/${count})`,
    labelShort: `${jahr} (${filteredZiels.length}/${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'zielJahrFolder',
    treeId: `${apId}ApzielJahrFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr],
    hasChildren: !!filteredZiels.length,
    fetcherName: 'useZielsOfJahrNavData',
    fetcherParams: { projId, apId, jahr },
    menus: filteredZiels.map((p) => ({
      id: p?.id,
      label: p?.label,
      jahr: p?.jahr,
      treeNodeType: 'table',
      treeMenuType: 'ziel',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr, p?.id],
      fetcherName: 'useZielNavData',
      fetcherParams: { projId, apId, jahr, zielId: p?.id },
      hasChildren: !!filteredZiels.length,
    })),
  }

  return navData
}
