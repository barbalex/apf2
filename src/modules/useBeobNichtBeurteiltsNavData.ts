import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  treeBeobNichtBeurteiltGqlFilterForTreeAtom,
} from '../store/index.ts'
import { BeobnichtbeurteiltFilteredMapIcon } from '../components/NavElements/BeobnichtbeurteiltFilteredMapIcon.tsx'
import { BeobnichtbeurteiltFilteredAbsenzMapIcon } from '../components/NavElements/BeobnichtbeurteiltFilteredAbsenzMapIcon.tsx'
import { BeobnichtbeurteiltMapIcon } from '../components/NavElements/BeobnichtbeurteiltMapIcon.tsx'
import { BeobnichtbeurteiltAbsenzMapIcon } from '../components/NavElements/BeobnichtbeurteiltAbsenzMapIcon.tsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useBeobNichtBeurteiltsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const beobId = props?.beobId ?? params.beobId

  const beobNichtBeurteiltGqlFilterForTree = useAtomValue(
    treeBeobNichtBeurteiltGqlFilterForTreeAtom,
  )

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

  const { data } = useQuery({
    queryKey: [
      'treeBeobNichtBeurteilt',
      apId,
      beobNichtBeurteiltGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
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
              nodes {
                id
                label
                absenz
              }
            }
          }
        `,
        variables: {
          beobNichtBeurteiltFilter: {
            ...beobNichtBeurteiltGqlFilterForTree,
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
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const count = data.beobsNichtBeurteilt.totalCount
  const filteredCount = data.filteredBeobsNichtBeurteilt.nodes.length

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
    component: NodeWithList,
    menus: data.filteredBeobsNichtBeurteilt.nodes.map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'beobNichtBeurteilt',
      treeId: p.id,
      treeTableId: p.id,
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
        p.absenz ?
          beobId === p.id ?
            [BeobnichtbeurteiltFilteredAbsenzMapIcon]
          : [BeobnichtbeurteiltAbsenzMapIcon]
        : beobId === p.id ?
          [BeobnichtbeurteiltFilteredMapIcon]
        : [BeobnichtbeurteiltMapIcon],
    })),
  }

  return navData
}
