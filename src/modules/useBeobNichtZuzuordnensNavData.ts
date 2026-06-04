import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  treeBeobNichtZuzuordnenGqlFilterForTreeAtom,
} from '../store/index.ts'
import { BeobnichtzuzuordnenFilteredMapIcon } from '../components/NavElements/BeobnichtzuzuordnenFilteredMapIcon.tsx'
import { BeobnichtzuzuordnenFilteredAbsenzMapIcon } from '../components/NavElements/BeobnichtzuzuordnenFilteredAbsenzMapIcon.tsx'
import { BeobnichtzuzuordnenMapIcon } from '../components/NavElements/BeobnichtzuzuordnenMapIcon.tsx'
import { BeobnichtzuzuordnenAbsenzMapIcon } from '../components/NavElements/BeobnichtzuzuordnenAbsenzMapIcon.tsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useBeobNichtZuzuordnensNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const beobId = props?.beobId ?? params.beobId

  const beobNichtZuzuordnenGqlFilterForTree = useAtomValue(
    treeBeobNichtZuzuordnenGqlFilterForTreeAtom,
  )

  const allBeobNichtZuzuordnenFilter = {
    nichtZuordnen: { equalTo: true },
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
      'treeBeobNichtZuzuordnen',
      apId,
      beobNichtZuzuordnenGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavBeobNichtZuzuordnensQuery(
            $beobNichtZuzuordnenFilter: BeobFilter!
            $allBeobNichtZuzuordnenFilter: BeobFilter!
          ) {
            beobsNichtZuzuordnen: allBeobs(
              filter: $allBeobNichtZuzuordnenFilter
            ) {
              totalCount
            }
            filteredBeobsNichtZuzuordnen: allBeobs(
              filter: $beobNichtZuzuordnenFilter
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
          beobNichtZuzuordnenFilter: {
            ...beobNichtZuzuordnenGqlFilterForTree,
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
          allBeobNichtZuzuordnenFilter,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const count = data.beobsNichtZuzuordnen.totalCount
  const filteredCount =
    data.filteredBeobsNichtZuzuordnen.nodes.length

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
    component: NodeWithList,
    menus: (data.filteredBeobsNichtZuzuordnen.nodes).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'beobNichtZuzuordnen',
      treeId: p.id,
      treeTableId: p.id,
      treeParentTableId: apId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'nicht-zuzuordnende-Beobachtungen',
        p.id,
      ],
      hasChildren: false,
      labelLeftElements:
        p.absenz ?
          beobId === p.id ?
            [BeobnichtzuzuordnenFilteredAbsenzMapIcon]
          : [BeobnichtzuzuordnenAbsenzMapIcon]
        : beobId === p.id ?
          [BeobnichtzuzuordnenFilteredMapIcon]
        : [BeobnichtzuzuordnenMapIcon],
    })),
  }

  return navData
}
