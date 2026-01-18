import { useContext, useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.ts'
import { BeobnichtzuzuordnenFilteredMapIcon } from '../components/NavElements/BeobnichtzuzuordnenFilteredMapIcon.tsx'
import { useProjekteTabs } from './useProjekteTabs.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useBeobNichtZuzuordnensNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const beobId = props?.beobId ?? params.beobId

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const store = useContext(MobxContext)

  const showBeobnichtzuzuordnenIcon =
    store.activeApfloraLayers?.includes('beobNichtZuzuordnen') && karteIsVisible
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)

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

  const { data, refetch } = useQuery({
    queryKey: [
      'treeBeobNichtZuzuordnen',
      apId,
      store.tree.beobNichtZuzuordnenGqlFilterForTree,
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
              totalCount
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: {
          beobNichtZuzuordnenFilter: {
            ...store.tree.beobNichtZuzuordnenGqlFilterForTree,
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
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  useEffect(
    () =>
      reaction(() => store.tree.beobNichtZuzuordnenGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.beobsNichtZuzuordnen?.totalCount ?? 0
  const filteredCount =
    data?.data?.filteredBeobsNichtZuzuordnen?.totalCount ?? 0

  const navData = {
    id: 'nicht-zuzuordnende-Beobachtungen',
    listFilter: 'beobNichtZuzuordnen',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/nicht-zuzuordnende-Beobachtungen`,
    label: `Beobachtungen nicht zuzuordnen (${filteredCount}/${count})`,
    labelShort: `Beob. nicht zuzuordnen (${filteredCount}/${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'beobNichtZuzuordnenFolder',
    treeId: `${apId}BeobNichtZuzuordnenFolder`,
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
    menus: (data?.data?.filteredBeobsNichtZuzuordnen?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'beobNichtZuzuordnen',
      treeId: p.id,
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
        showBeobnichtzuzuordnenIcon && beobId === p.id ?
          [BeobnichtzuzuordnenFilteredMapIcon]
        : undefined,
    })),
  }

  return navData
}
