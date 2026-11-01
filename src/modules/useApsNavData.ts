import { apiCount, apiFetch } from './api.ts'
import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  treeApGqlFilterForTreeAtom,
  treeApIdInActiveNodeArrayAtom,
} from '../store/index.ts'

export const useApsNavData = (
  props?: { projId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''

  const apGqlFilterForTree = useAtomValue(treeApGqlFilterForTreeAtom)
  const apIdInActiveNodeArray = useAtomValue(treeApIdInActiveNodeArrayAtom)

  const { data } = useSuspenseQuery({
    queryKey: ['treeAp', apGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the cascade filter jsonb goes straight into the RPC
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_ap?select=id,label`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: apGqlFilterForTree,
              p_order: [{ field: 'label', dir: 'asc' }],
            }),
          },
        ),
        apiCount('/q_ap'),
      ])
      return {
        allAps: { nodes: nodes ?? [] },
        totalCount: { totalCount },
      }
    },
  })

  // if the active ap was filtered out of the tree list (url was opened
  // directly on it), fetch it separately and add it to the menus.
  // Deliberately NOT part of apGqlFilterForTree: that would change
  // the suspense query key on every ap change, suspending the tree
  // and resetting its scroll position
  const { data: activeApData } = useQuery({
    queryKey: ['treeApActive', apIdInActiveNodeArray],
    enabled: !!apIdInActiveNodeArray,
    queryFn: async () => {
      if (!apIdInActiveNodeArray) return null
      const nodes = await apiFetch<{ id: string; label: string | null }[]>(
        `/q_ap?id=eq.${apIdInActiveNodeArray}&select=id,label`,
      )
      return { allAps: { nodes: nodes ?? [] } }
    },
  })
  const activeAp = activeApData?.allAps?.nodes?.[0] ?? null

  const apMenus = (data.allAps?.nodes ?? [])
    .filter((p) => !!p?.id)
    .map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table' as const,
      treeMenuType: 'ap',
      singleElementName: 'Art',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: projId,
      treeUrl: ['Projekte', projId, 'Arten', p?.id],
      hasChildren: true,
      fetcherName: 'useApNavData',
      fetcherParams: { projId, apId: p?.id },
    }))
  // add the active ap if it is not in the list due to filters
  if (activeAp?.id && !apMenus.some((m) => m.id === activeAp.id)) {
    apMenus.push({
      id: activeAp.id,
      label: activeAp.label,
      treeNodeType: 'table' as const,
      treeMenuType: 'ap',
      singleElementName: 'Art',
      treeId: activeAp.id,
      treeTableId: activeAp.id,
      treeParentTableId: projId,
      treeUrl: ['Projekte', projId, 'Arten', activeAp.id],
      hasChildren: true,
      fetcherName: 'useApNavData',
      fetcherParams: { projId, apId: activeAp.id },
    })
    apMenus.sort((a, b) => (a.label ?? '').localeCompare(b.label ?? ''))
  }

  const count = apMenus.length
  const totalCount = data.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Arten',
    listFilter: 'ap',
    url: `/Daten/Projekte/${projId}/Arten`,
    label: `Arten (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'apFolder',
    treeId: `${projId}ApFolder`,
    treeTableId: projId,
    treeParentTableId: projId,
    treeUrl: [`Daten`, `Projekte`, projId, `Arten`],
    hasChildren: !!count,
    fetcherName: 'useApsNavData',
    fetcherParams: { projId },
    menus: apMenus,
  }

  return navData
}
