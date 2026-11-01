import { apiCount, apiFetch, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  treeApGqlFilterForTreeAtom,
  treeApberuebersichtGqlFilterForTreeAtom,
} from '../store/index.ts'

export const useProjektNavData = (
  props?: { projId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId =
    props?.projId ?? params?.projId ?? '017d3474-6b07-7c56-86ef-84b0af1de903'

  const apGqlFilterForTree = useAtomValue(treeApGqlFilterForTreeAtom)
  const apberuebersichtGqlFilterForTree = useAtomValue(
    treeApberuebersichtGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeProject',
      projId,
      apGqlFilterForTree,
      apberuebersichtGqlFilterForTree,
    ],
    queryFn: async () => {
      // phase 5: the former XByProjId relation constraints merge into the
      // cascade filters; sibling keys are ANDed by compile_filter
      const projOf = (filter: object) => ({
        ...filter,
        projektByProjId: {
          ...((filter as { projektByProjId?: object }).projektByProjId ?? {}),
          id: { equalTo: projId },
        },
      })
      const [
        projekt,
        apberuebersichtsFiltered,
        apberuebersichtsAll,
        apsFiltered,
        apsAll,
      ] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/v_projekt?id=eq.${projId}&select=id,label`,
        ),
        rpcCount('query_apberuebersicht', {
          p_filter: projOf(apberuebersichtGqlFilterForTree),
        }),
        apiCount(`/q_apberuebersicht?proj_id=eq.${projId}`),
        rpcCount('query_ap', { p_filter: projOf(apGqlFilterForTree) }),
        apiCount(`/q_ap?proj_id=eq.${projId}`),
      ])
      return {
        projektById: {
          id: projId,
          label: projekt?.[0]?.label,
          filteredApberuebersichts: { totalCount: apberuebersichtsFiltered },
          allApberuebersichts: { totalCount: apberuebersichtsAll },
          filteredAps: { totalCount: apsFiltered },
          allAps: { totalCount: apsAll },
        },
      }
    },
  })

  const label = data.projektById?.label ?? 'Projekt'
  const artsCount = data.projektById?.filteredAps.totalCount
  const allArtsCount = data.projektById?.allAps.totalCount
  const apberuebersichtsCount =
    data.projektById?.filteredApberuebersichts.totalCount
  const allApberuebersichtsCount =
    data.projektById?.allApberuebersichts.totalCount
  const navData = {
    id: projId,
    url: `/Daten/Projekte/${projId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'projekt',
    treeId: projId,
    treeTableId: projId,
    treeParentTableId: projId,
    treeUrl: ['Projekte', projId],
    hasChildren: true,
    fetcherName: 'useProjektNavData',
    fetcherParams: { projId },
    menus: [
      {
        id: 'Projekt',
        label: 'Projekt',
        isSelf: true,
      },
      {
        id: 'Arten',
        label: `Arten (${artsCount}/${allArtsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'apFolder',
        treeId: `${projId}/ApFolder`,
        treeTableId: projId,
        treeParentTableId: projId,
        treeUrl: ['Projekte', projId, 'Arten'],
        hasChildren: !!artsCount,
        fetcherName: 'useApsNavData',
        fetcherParams: { projId },
      },
      {
        id: 'AP-Berichte',
        label: `AP-Berichte (${apberuebersichtsCount}/${allApberuebersichtsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'apberuebersichtFolder',
        treeId: `${projId}ApberuebersichtFolder`,
        treeTableId: projId,
        treeParentTableId: projId,
        treeUrl: ['Projekte', projId, 'AP-Berichte'],
        hasChildren: !!apberuebersichtsCount,
        fetcherName: 'useApberuebersichtsNavData',
        fetcherParams: { projId },
      },
    ],
  }

  return navData
}
