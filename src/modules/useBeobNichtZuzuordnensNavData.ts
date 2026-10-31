import { apiFetch, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { treeBeobNichtZuzuordnenGqlFilterForTreeAtom } from '../store/index.ts'
import { BeobnichtzuzuordnenFilteredMapIcon } from '../components/NavElements/BeobnichtzuzuordnenFilteredMapIcon.tsx'
import { BeobnichtzuzuordnenFilteredAbsenzMapIcon } from '../components/NavElements/BeobnichtzuzuordnenFilteredAbsenzMapIcon.tsx'
import { BeobnichtzuzuordnenMapIcon } from '../components/NavElements/BeobnichtzuzuordnenMapIcon.tsx'
import { BeobnichtzuzuordnenAbsenzMapIcon } from '../components/NavElements/BeobnichtzuzuordnenAbsenzMapIcon.tsx'

export const useBeobNichtZuzuordnensNavData = (
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

  const beobNichtZuzuordnenGqlFilterForTree = useAtomValue(
    treeBeobNichtZuzuordnenGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeBeobNichtZuzuordnen',
      apId,
      beobNichtZuzuordnenGqlFilterForTree,
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
              ...beobNichtZuzuordnenGqlFilterForTree,
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
            nichtZuordnen: { equalTo: true },
            artId: { in: artIds },
          },
        }),
      ])
      return {
        beobsNichtZuzuordnen: { totalCount: count },
        filteredBeobsNichtZuzuordnen: { nodes: nodes ?? [] },
      }
    },
  })

  const count = data.beobsNichtZuzuordnen?.totalCount
  const filteredCount = data.filteredBeobsNichtZuzuordnen?.nodes.length

  const navData = {
    id: 'nicht-zuzuordnende-Beobachtungen',
    listFilter: 'beobNichtZuzuordnen',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/nicht-zuzuordnende-Beobachtungen`,
    label: `Beobachtungen nicht zuzuordnen (${filteredCount}/${count})`,
    labelShort: `Beob. nicht zuzuordnen (${filteredCount}/${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'beobNichtZuzuordnenFolder',
    treeId: `${apId}BeobNichtZuzuordnenFolder`,
    treeTableId: apId,
    treeParentTableId: apId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'nicht-zuzuordnende-Beobachtungen',
    ],
    hasChildren: !!filteredCount,
    menus: (data.filteredBeobsNichtZuzuordnen?.nodes ?? []).map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'beobNichtZuzuordnen',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: apId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'nicht-zuzuordnende-Beobachtungen',
        p?.id,
      ],
      hasChildren: false,
      labelLeftElements:
        p?.absenz ?
          beobId === p?.id ?
            [BeobnichtzuzuordnenFilteredAbsenzMapIcon]
          : [BeobnichtzuzuordnenAbsenzMapIcon]
        : beobId === p?.id ? [BeobnichtzuzuordnenFilteredMapIcon]
        : [BeobnichtzuzuordnenMapIcon],
    })),
  }

  return navData
}
