import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { treeBeobZugeordnetGqlFilterForTreeAtom } from '../store/index.ts'
import { BeobzugeordnetFilteredMapIcon } from '../components/NavElements/BeobzugeordnetFilteredMapIcon.tsx'
import { BeobzugeordnetFilteredAbsenzMapIcon } from '../components/NavElements/BeobzugeordnetFilteredAbsenzMapIcon.tsx'
import { BeobzugeordnetMapIcon } from '../components/NavElements/BeobzugeordnetMapIcon.tsx'
import { BeobzugeordnetAbsenzMapIcon } from '../components/NavElements/BeobzugeordnetAbsenzMapIcon.tsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useBeobZugeordnetsNavData = (props?: { projId?: string | undefined; apId?: string | undefined; popId?: string | undefined; tpopId?: string | undefined; beobId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()

  const params = useParams()
  const projId = (props?.projId ?? params.projId ?? '')
  const apId = (props?.apId ?? params.apId ?? '')
  const popId = (props?.popId ?? params.popId ?? '')
  const tpopId = (props?.tpopId ?? params.tpopId ?? '')
  const beobId = (props?.beobId ?? params.beobId ?? '')

  const beobZugeordnetGqlFilterForTree = useAtomValue(
    treeBeobZugeordnetGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: ['treeBeobZugeordnet', tpopId, beobZugeordnetGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
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
                absenz
              }
            }
          }
        `),
        variables: {
          beobZugeordnetFilter: {
            ...beobZugeordnetGqlFilterForTree,
            tpopId: { equalTo: tpopId },
          },
          allBeobZugeordnetFilter: { tpopId: { equalTo: tpopId } },
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
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
    component: NodeWithList,
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
