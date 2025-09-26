import { useMemo, useContext, useEffect, useState, useCallback } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { BeobnichtzuzuordnenFilteredMapIcon } from '../components/NavElements/BeobnichtzuzuordnenFilteredMapIcon.jsx'
import { useProjekteTabs } from './useProjekteTabs.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

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
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])

  const allBeobNichtZuzuordnenFilter = useMemo(
    () => ({
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
    }),
    [apId],
  )

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeBeobNichtZuzuordnen',
      apId,
      store.tree.beobNichtZuzuordnenGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
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
      }),
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

  const navData = useMemo(
    () => ({
      id: 'nicht-zuzuordnende-Beobachtungen',
      listFilter: 'beobNichtZuzuordnen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/nicht-zuzuordnende-Beobachtungen`,
      label: `Beobachtungen nicht zuzuordnen (${isLoading ? '...' : `${filteredCount}/${count}`})`,
      labelShort: `Beob. nicht zuzuordnen (${isLoading ? '...' : `${filteredCount}/${count}`})`,
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
      menus: (data?.data?.filteredBeobsNichtZuzuordnen?.nodes ?? []).map(
        (p) => ({
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
        }),
      ),
    }),
    [
      apId,
      beobId,
      count,
      data?.data?.filteredBeobsNichtZuzuordnen?.nodes,
      filteredCount,
      isLoading,
      projId,
      showBeobnichtzuzuordnenIcon,
    ],
  )

  return { isLoading, error, navData }
}
