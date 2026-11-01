import { apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { countBy } from 'es-toolkit'

import { getZielGqlFilterForTree } from './getZielGqlFilterForTree.ts'

const getZieljahrsCount = (ziels: ({ jahr?: number | null } | null)[]) => {
  const jahrs = countBy(ziels, (e) => e?.jahr ?? 0)
  const count = Object.keys(jahrs).length
  return count
}

export const useZieljahrsNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''

  // Get filter before useQuery so changes trigger refetch
  const zielGqlFilterForTree = getZielGqlFilterForTree(apId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeZieljahrs', apId, zielGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former zielsByApId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...zielGqlFilterForTree,
        apByApId: {
          ...((zielGqlFilterForTree as { apByApId?: object }).apByApId ?? {}),
          id: { equalTo: apId },
        },
      }
      const [ziels, filteredZiels] = await Promise.all([
        apiFetch<{ id: string; jahr: number | null }[]>(
          `/q_ziel?ap_id=eq.${apId}&select=id,jahr`,
        ),
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
      ])
      return {
        apById: {
          id: apId,
          zielsByApId: { nodes: ziels ?? [] },
          filteredZiels: { nodes: filteredZiels ?? [] },
        },
      }
    },
  })

  const ziels = data.apById?.zielsByApId?.nodes ?? []
  const filteredZiels = data.apById?.filteredZiels?.nodes ?? []
  const zieljahrsCount = getZieljahrsCount(ziels)
  const countByJahr = countBy(filteredZiels, (e) => e?.jahr ?? 0) as Record<
    string,
    number
  >
  const unfilteredCountByJahr = countBy(ziels, (e) => e?.jahr ?? 0) as Record<
    string,
    number
  >

  // convert into array of objects with id=jahr and count
  const menus = Object.keys(countByJahr).map((jahr) => ({
    id: +jahr,
    label: `${jahr} (${countByJahr[jahr]}/${unfilteredCountByJahr[jahr]})`,
    jahr: +jahr,
    treeNodeType: 'folder',
    treeMenuType: 'zieljahrFolder',
    treeId: `${apId}ZielJahreFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', +jahr],
    fetcherName: 'useZielsOfJahrNavData',
    fetcherParams: { projId, apId, jahr: +jahr },
    hasChildren: !!countByJahr[jahr],
  }))

  const navData = {
    id: 'AP-Ziele',
    label: `AP-Ziele Jahre (${menus.length}/${zieljahrsCount})`,
    listFilter: 'ziel',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele`,
    treeNodeType: 'folder',
    treeMenuType: 'zieljahrsFolder',
    treeId: `${apId}ZieljahrsFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele'],
    hasChildren: !!zieljahrsCount,
    fetcherName: 'useZieljahrsNavData',
    fetcherParams: { projId, apId },
    menus,
  }

  return navData
}
