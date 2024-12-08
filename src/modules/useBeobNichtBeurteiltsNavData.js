import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../storeContext.js'

export const useBeobNichtBeurteiltsNavData = (props) => {
  const apolloClient = useApolloClient()
  const { projId, apId: apIdFromParams } = useParams()
  const apId = props?.apId ?? apIdFromParams

  const store = useContext(MobxContext)

  // const allBeobNichtZuzuordnenFilter = useMemo(
  //   () => ({
  //     nichtZuordnen: { equalTo: true },
  //     aeTaxonomyByArtId: {
  //       apartsByArtId: {
  //         some: {
  //           apByApId: {
  //             id: { equalTo: apId },
  //           },
  //         },
  //       },
  //     },
  //   }),
  //   [apId],
  // )
  const allBeobNichtBeurteiltFilter = useMemo(
    () => ({
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
    }),
    [apId],
  )

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeBeobNichtBeurteilts',
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

  const count = data?.data?.beobsNichtBeurteilt?.totalCount ?? 0
  const filteredCount = data?.data?.filteredBeobsNichtBeurteilt?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'nicht-beurteilte-Beobachtungen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/nicht-beurteilte-Beobachtungen`,
      label: `Beobachtungen nicht beurteilt (${isLoading ? '...' : `${filteredCount}/${count}`})`,
      labelShort: `Beob. nicht beurteilt (${isLoading ? '...' : `${filteredCount}/${count}`})`,
      // leave totalCount undefined as the menus are folders
      menus:
        data?.data?.filteredBeobsNichtBeurteilt?.nodes?.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [
      apId,
      count,
      data?.data?.filteredBeobsNichtBeurteilt?.nodes,
      filteredCount,
      isLoading,
      projId,
    ],
  )

  return { isLoading, error, navData }
}
