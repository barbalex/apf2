import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getEkzaehleinheitGqlFilterForTree } from './getEkzaehleinheitGqlFilterForTree.ts'

export const useEkzaehleinheitsNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const ekzaehleinheitGqlFilterForTree = getEkzaehleinheitGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeEkzaehleinheit', apId, ekzaehleinheitGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former ekzaehleinheitsByApId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...ekzaehleinheitGqlFilterForTree,
        apByApId: {
          ...((ekzaehleinheitGqlFilterForTree as { apByApId?: object })
            .apByApId ?? {}),
          id: { equalTo: apId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_ekzaehleinheit?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [
                { field: 'sort', dir: 'asc' },
                { field: 'label', dir: 'asc' },
              ],
            }),
          },
        ),
        apiCount(`/q_ekzaehleinheit?ap_id=eq.${apId}`),
      ])
      return {
        apById: {
          id: apId,
          ekzaehleinheitsByApId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  const rows = data.apById?.ekzaehleinheitsByApId?.nodes ?? []
  const count = rows.length
  const totalCount = data.apById?.totalCount.totalCount

  const navData = {
    id: 'EK-Zähleinheiten',
    listFilter: 'ekzaehleinheit',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/EK-Zähleinheiten`,
    label: `EK-Zähleinheiten (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'ekzaehleinheitFolder',
    treeId: `${apId}EkzaehleinheitFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten'],
    hasChildren: !!count,
    menus: rows.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'ekzaehleinheit',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
