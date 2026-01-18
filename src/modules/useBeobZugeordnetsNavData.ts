import { useContext, useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.ts'
import { BeobzugeordnetFilteredMapIcon } from '../components/NavElements/BeobzugeordnetFilteredMapIcon.tsx'
import { useProjekteTabs } from './useProjekteTabs.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useBeobZugeordnetsNavData = (props) => {
  const apolloClient = useApolloClient()
  const store = useContext(MobxContext)

  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const beobId = props?.beobId ?? params.beobId

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const showBeobzugeordnetIcon =
    store.activeApfloraLayers?.includes('beobZugeordnet') && karteIsVisible
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)

  const { data, refetch } = useQuery({
    queryKey: [
      'treeBeobZugeordnet',
      tpopId,
      store.tree.beobZugeordnetGqlFilterForTree,
    ],
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
              totalCount
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          beobZugeordnetFilter: {
            ...store.tree.beobZugeordnetGqlFilterForTree,
            tpopId: { equalTo: tpopId },
          },
          allBeobZugeordnetFilter: { tpopId: { equalTo: tpopId } },
        },
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  useEffect(
    () => reaction(() => store.tree.beobZugeordnetGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.beobsZugeordnet?.totalCount ?? 0
  const filteredCount = data?.data?.filteredBeobsZugeordnet?.totalCount ?? 0

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
        showBeobzugeordnetIcon && beobId === p.id ?
          [BeobzugeordnetFilteredMapIcon]
        : undefined,
    })),
  }

  return { navData }
}
