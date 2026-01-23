import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  mapActiveApfloraLayersAtom,
  treeBeobZugeordnetGqlFilterForTreeAtom,
  store,
} from '../store/index.ts'
import { BeobzugeordnetFilteredMapIcon } from '../components/NavElements/BeobzugeordnetFilteredMapIcon.tsx'
import { useProjekteTabs } from './useProjekteTabs.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useBeobZugeordnetsNavData = (props) => {
  const apolloClient = useApolloClient()

  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const beobId = props?.beobId ?? params.beobId

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const beobZugeordnetGqlFilterForTree = useAtomValue(
    treeBeobZugeordnetGqlFilterForTreeAtom,
  )
  const showBeobzugeordnetIcon =
    activeApfloraLayers?.includes('beobZugeordnet') && karteIsVisible

  const { data } = useQuery({
    queryKey: ['treeBeobZugeordnet', tpopId, beobZugeordnetGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavBeobZugeordnetsQuery(
            $beobZugeordnetFilter: BeobFilter!
            $allBeobZugeordnetFilter: BeobFilter!
          ) {
            beobsZugeordnet: allBeobs(filter: $allBeobZugeordnetFilter) {
              totalCount
            }
            filteredBeobsZugeordnet: allBeobs(
              filter: $beobZugeordnetFilter
              orderBy: [DATUM_DESC, AUTOR_ASC]
            ) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          beobZugeordnetFilter: {
            ...beobZugeordnetGqlFilterForTree,
            tpopId: { equalTo: tpopId },
          },
          allBeobZugeordnetFilter: { tpopId: { equalTo: tpopId } },
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.beobsZugeordnet?.totalCount ?? 0
  const filteredCount = data?.data?.filteredBeobsZugeordnet?.nodes?.length ?? 0

  const navData = {
    id: 'Beobachtungen',
    listFilter: 'beobZugeordnet',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Beobachtungen`,
    label: `Beobachtungen zugeordnet (${filteredCount}/${count})`,
    labelShort: `Beob. zugeordnet (${filteredCount}/${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'beobZugeordnetFolder',
    treeId: `${tpopId}BeobZugeordnetFolder`,
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
    component: NodeWithList,
    menus: (data?.data?.filteredBeobsZugeordnet?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'beobZugeordnet',
      treeId: p.id,
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
        p.id,
      ],
      hasChildren: false,
      labelLeftElements:
        showBeobzugeordnetIcon && beobId === p.id
          ? [BeobzugeordnetFilteredMapIcon]
          : undefined,
    })),
  }

  return navData
}
