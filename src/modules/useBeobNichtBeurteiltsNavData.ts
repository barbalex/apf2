import { apiFetch, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { treeBeobNichtBeurteiltGqlFilterForTreeAtom } from '../store/index.ts'
import { BeobnichtbeurteiltFilteredMapIcon } from '../components/NavElements/BeobnichtbeurteiltFilteredMapIcon.tsx'
import { BeobnichtbeurteiltFilteredAbsenzMapIcon } from '../components/NavElements/BeobnichtbeurteiltFilteredAbsenzMapIcon.tsx'
import { BeobnichtbeurteiltMapIcon } from '../components/NavElements/BeobnichtbeurteiltMapIcon.tsx'
import { BeobnichtbeurteiltAbsenzMapIcon } from '../components/NavElements/BeobnichtbeurteiltAbsenzMapIcon.tsx'

export const useBeobNichtBeurteiltsNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        beobId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const beobId = props?.beobId ?? params.beobId ?? ''

  const beobNichtBeurteiltGqlFilterForTree = useAtomValue(
    treeBeobNichtBeurteiltGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeBeobNichtBeurteilt',
      apId,
      beobNichtBeurteiltGqlFilterForTree,
    ],
    queryFn: async () => {
      // phase 5: the old aeTaxonomyByArtId.apartsByArtId reverse relation
      // scopes beobs to the ap's taxa — expressed as an artId in-list of
      // the ap's apart rows instead
      const aparts = await apiFetch<{ art_id: string | null }[]>(
        `/apart?ap_id=eq.${apId}&select=art_id&art_id=not.is.null`,
      )
      const artIds = (aparts ?? []).map((r) => r.art_id) as string[]
      const [nodes, count] = await Promise.all([
        apiFetch<
          { id: string; label: string | null; absenz: boolean | null }[]
        >('/rpc/query_beob?select=id,label,absenz', {
          method: 'POST',
          body: JSON.stringify({
            p_filter: {
              ...beobNichtBeurteiltGqlFilterForTree,
              artId: { in: artIds },
            },
            p_order: [
              { field: 'datum', dir: 'desc' },
              { field: 'autor', dir: 'asc' },
            ],
          }),
        }),
        rpcCount('query_beob', {
          p_filter: {
            tpopId: { isNull: true },
            nichtZuordnen: { equalTo: false },
            artId: { in: artIds },
          },
        }),
      ])
      return {
        beobsNichtBeurteilt: { totalCount: count },
        filteredBeobsNichtBeurteilt: { nodes: nodes ?? [] },
      }
    },
  })

  const count = data.beobsNichtBeurteilt?.totalCount
  const filteredCount = data.filteredBeobsNichtBeurteilt?.nodes.length

  const navData = {
    id: 'nicht-beurteilte-Beobachtungen',
    listFilter: 'beobNichtBeurteilt',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/nicht-beurteilte-Beobachtungen`,
    label: `Beobachtungen nicht beurteilt (${filteredCount}/${count})`,
    labelShort: `Beob. nicht beurteilt (${filteredCount}/${count})`,
    treeNodeType: 'folder',
    treeNodeMenuType: 'beobNichtBeurteiltFolder',
    treeId: `${apId}BeobNichtBeurteiltFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'nicht-beurteilte-Beobachtungen',
    ],
    hasChildren: !!filteredCount,
    menus: data.filteredBeobsNichtBeurteilt?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'beobNichtBeurteilt',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'nicht-beurteilte-Beobachtungen',
        p?.id,
      ],
      hasChildren: false,
      labelLeftElements:
        p?.absenz ?
          beobId === p?.id ?
            [BeobnichtbeurteiltFilteredAbsenzMapIcon]
          : [BeobnichtbeurteiltAbsenzMapIcon]
        : beobId === p?.id ? [BeobnichtbeurteiltFilteredMapIcon]
        : [BeobnichtbeurteiltMapIcon],
    })),
  }

  return navData
}
