import { apiFetch, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { treeBeobZugeordnetGqlFilterForTreeAtom } from '../store/index.ts'
import { BeobzugeordnetFilteredMapIcon } from '../components/NavElements/BeobzugeordnetFilteredMapIcon.tsx'
import { BeobzugeordnetFilteredAbsenzMapIcon } from '../components/NavElements/BeobzugeordnetFilteredAbsenzMapIcon.tsx'
import { BeobzugeordnetMapIcon } from '../components/NavElements/BeobzugeordnetMapIcon.tsx'
import { BeobzugeordnetAbsenzMapIcon } from '../components/NavElements/BeobzugeordnetAbsenzMapIcon.tsx'

export const useBeobZugeordnetsNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
        tpopId?: string | undefined
        beobId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()

  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''
  const tpopId = props?.tpopId ?? params.tpopId ?? ''
  const beobId = props?.beobId ?? params.beobId ?? ''

  const beobZugeordnetGqlFilterForTree = useAtomValue(
    treeBeobZugeordnetGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: ['treeBeobZugeordnet', tpopId, beobZugeordnetGqlFilterForTree],
    queryFn: async () => {
      const [nodes, count] = await Promise.all([
        apiFetch<
          { id: string; label: string | null; absenz: boolean | null }[]
        >('/rpc/query_beob?select=id,label,absenz', {
          method: 'POST',
          body: JSON.stringify({
            p_filter: {
              ...beobZugeordnetGqlFilterForTree,
              tpopId: { equalTo: tpopId },
            },
            p_order: [
              { field: 'datum', dir: 'desc' },
              { field: 'autor', dir: 'asc' },
            ],
          }),
        }),
        rpcCount('query_beob', {
          p_filter: { tpopId: { equalTo: tpopId } },
        }),
      ])
      return {
        beobsZugeordnet: { totalCount: count },
        filteredBeobsZugeordnet: { nodes: nodes ?? [] },
      }
    },
  })

  const count = data.beobsZugeordnet?.totalCount ?? 0
  const filteredCount = data.filteredBeobsZugeordnet?.nodes?.length ?? 0

  const navData = {
    id: 'Beobachtungen',
    listFilter: 'beobZugeordnet',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen`,
    label: `Beobachtungen zugeordnet (${filteredCount}/${count})`,
    labelShort: `Beob. zugeordnet (${filteredCount}/${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'beobZugeordnetFolder',
    treeId: `${tpopId}BeobZugeordnetFolder`,
    treeTableId: tpopId,
    treeParentTableId: tpopId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
      'Beobachtungen',
    ],
    hasChildren: !!filteredCount,
    menus: data.filteredBeobsZugeordnet?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'beobZugeordnet',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: tpopId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Beobachtungen',
        p?.id,
      ],
      hasChildren: false,
      labelLeftElements:
        p?.absenz ?
          beobId === p?.id ?
            [BeobzugeordnetFilteredAbsenzMapIcon]
          : [BeobzugeordnetAbsenzMapIcon]
        : beobId === p?.id ? [BeobzugeordnetFilteredMapIcon]
        : [BeobzugeordnetMapIcon],
    })),
  }

  return navData
}
