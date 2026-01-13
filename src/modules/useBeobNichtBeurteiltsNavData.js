import { useContext, useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { BeobnichtbeurteiltFilteredMapIcon } from '../components/NavElements/BeobnichtbeurteiltFilteredMapIcon.jsx'
import { useProjekteTabs } from './useProjekteTabs.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useBeobNichtBeurteiltsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const beobId = props?.beobId ?? params.beobId

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const store = useContext(MobxContext)

  const showBeobnichtbeurteiltIcon =
    store.activeApfloraLayers?.includes('beobNichtBeurteilt') && karteIsVisible
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)

  const allBeobNichtBeurteiltFilter = {
    tpopId: { isNull: true },
    nichtZuordnen: { equalTo: false },
    aeTaxonomyByArtId: {
      apartsByArtId: {
        some: {
          apByApId: {
            id: { equalTo: apId },
          },
        },
      },
    },
  }

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeBeobNichtBeurteilt',
      apId,
      store.tree.beobNichtBeurteiltGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavBeobNichtBeurteiltsQuery(
            $beobNichtBeurteiltFilter: BeobFilter!
            $allBeobNichtBeurteiltFilter: BeobFilter!
          ) {
            beobsNichtBeurteilt: allBeobs(
              filter: $allBeobNichtBeurteiltFilter
            ) {
              totalCount
            }
            filteredBeobsNichtBeurteilt: allBeobs(
              filter: $beobNichtBeurteiltFilter
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
          beobNichtBeurteiltFilter: {
            ...store.tree.beobNichtBeurteiltGqlFilterForTree,
            aeTaxonomyByArtId: {
              apartsByArtId: {
                some: {
                  apByApId: {
                    id: { equalTo: apId },
                  },
                },
              },
            },
          },
          allBeobNichtBeurteiltFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () =>
      reaction(() => store.tree.beobNichtBeurteiltGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.beobsNichtBeurteilt?.totalCount ?? 0
  const filteredCount = data?.data?.filteredBeobsNichtBeurteilt?.totalCount ?? 0

  const navData = {
    id: 'nicht-beurteilte-Beobachtungen',
    listFilter: 'beobNichtBeurteilt',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/nicht-beurteilte-Beobachtungen`,
    label: `Beobachtungen nicht beurteilt (${isLoading ? '...' : `${filteredCount}/${count}`})`,
    labelShort: `Beob. nicht beurteilt (${isLoading ? '...' : `${filteredCount}/${count}`})`,
    treeNodeType: 'folder',
    treeNodeMenuType: 'beobNichtBeurteiltFolder',
    treeId: `${apId}BeobNichtBeurteiltFolder`,
    treeParentTableId: apId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'nicht-beurteilte-Beobachtungen',
    ],
    hasChildren: !!filteredCount,
    component: NodeWithList,
    menus: (data?.data?.filteredBeobsNichtBeurteilt?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'beobNichtBeurteilt',
      treeId: p.id,
      treeParentTableId: apId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'nicht-beurteilte-Beobachtungen',
        p.id,
      ],
      hasChildren: false,
      labelLeftElements:
        showBeobnichtbeurteiltIcon && beobId === p.id ?
          [BeobnichtbeurteiltFilteredMapIcon]
        : undefined,
    })),
  }

  return { isLoading, error, navData }
}
