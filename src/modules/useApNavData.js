import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'
import countBy from 'lodash/countBy'
import { getSnapshot } from 'mobx-state-tree'

import { StoreContext } from '../storeContext.js'

export const useApNavData = () => {
  const apolloClient = useApolloClient()
  const { projId, apId } = useParams()

  const store = useContext(StoreContext)

  const beobNichtZuzuordnenApFilter = useMemo(
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
  const beobNichtBeurteiltApFilter = useMemo(
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
  const beobNichtZuzuordnenFilter = useMemo(
    () => ({
      ...store.tree.beobGqlFilterForTree('nichtZuzuordnen'),
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
    [apId, store.tree],
  )
  const beobNichtBeurteiltFilter = useMemo(
    () => ({
      ...store.tree.beobGqlFilterForTree('nichtBeurteilt'),
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
    [apId, store.tree],
  )

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeAp', projId, apId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavApQuery(
            $apId: UUID!
            $popFilter: PopFilter!
            $zielFilter: ZielFilter!
            $erfkritFilter: ErfkritFilter!
            $apartFilter: ApartFilter!
            $assozartFilter: AssozartFilter!
            $ekfrequenzFilter: EkfrequenzFilter!
            $beobNichtBeurteiltFilter: BeobFilter!
            $beobNichtZuzuordnenFilter: BeobFilter!
            $beobNichtZuzuordnenApFilter: BeobFilter!
            $beobNichtBeurteiltApFilter: BeobFilter!
          ) {
            apById(id: $apId) {
              id
              label
              popsByApId {
                totalCount
              }
              filteredPops: popsByApId(filter: $popFilter) {
                totalCount
              }
              zielsByApId {
                totalCount
                nodes {
                  id
                  jahr
                }
              }
              filteredZiels: zielsByApId(filter: $zielFilter) {
                totalCount
                nodes {
                  id
                  jahr
                }
              }
              erfkritsByApId {
                totalCount
              }
              filteredErfkrits: erfkritsByApId(filter: $erfkritFilter) {
                totalCount
              }
              apartsByApId {
                totalCount
              }
              filteredAparts: apartsByApId(filter: $apartFilter) {
                totalCount
              }
              assozartsByApId {
                totalCount
              }
              filteredAssozarts: assozartsByApId(filter: $assozartFilter) {
                totalCount
              }
              ekfrequenzsByApId {
                totalCount
              }
              filteredEkfrequenzs: ekfrequenzsByApId(
                filter: $ekfrequenzFilter
              ) {
                totalCount
              }
            }
            beobsNichtBeurteilt: allBeobs(filter: $beobNichtBeurteiltApFilter) {
              totalCount
            }
            filteredBeobsNichtBeurteilt: allBeobs(
              filter: $beobNichtBeurteiltFilter
            ) {
              totalCount
            }
            beobsNichtZuzuordnen: allBeobs(
              filter: $beobNichtZuzuordnenApFilter
            ) {
              totalCount
            }
            filteredBeobsNichtZuzuordnen: allBeobs(
              filter: $beobNichtZuzuordnenFilter
            ) {
              totalCount
            }
          }
        `,
        variables: {
          apId,
          popFilter: store.tree.popGqlFilterForTree,
          zielFilter: store.tree.zielGqlFilterForTree,
          erfkritFilter: store.tree.erfkritGqlFilterForTree,
          apartFilter: store.tree.apartGqlFilterForTree,
          assozartFilter: store.tree.assozartGqlFilterForTree,
          ekfrequenzFilter: store.tree.ekfrequenzGqlFilterForTree,
          beobNichtBeurteiltFilter,
          beobNichtZuzuordnenFilter,
          beobNichtZuzuordnenApFilter,
          beobNichtBeurteiltApFilter,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.popGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.zielGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.erfkritGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.apartGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.assozartGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.ekfrequenzGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.beobGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.apById?.label
  const popsCount = data?.data?.apById?.popsByApId?.totalCount ?? 0
  const filteredPopsCount = data?.data?.apById?.filteredPops?.totalCount ?? 0
  const apZiels = data?.data?.apById?.zielsByApId?.nodes ?? []
  const apZielJahrs = countBy(apZiels, 'jahr')
  const apZielJahrsCount = Object.keys(apZielJahrs).length
  const filteredApZiels = data?.data?.apById?.filteredZiels?.nodes ?? []
  const filteredApZielJahrs = countBy(filteredApZiels, 'jahr')
  const filteredApZielJahrsCount = Object.keys(filteredApZielJahrs).length
  const erfkritsCount = data?.data?.apById?.erfkritsByApId?.totalCount ?? 0
  const filteredErfkritsCount =
    data?.data?.apById?.filteredErfkrits?.totalCount ?? 0
  const apartsCount = data?.data?.apById?.apartsByApId?.totalCount ?? 0
  const filteredApartsCount =
    data?.data?.apById?.filteredAparts?.totalCount ?? 0
  const assozartsCount = data?.data?.apById?.assozartsByApId?.totalCount ?? 0
  const filteredAssozartsCount =
    data?.data?.apById?.filteredAssozarts?.totalCount ?? 0
  const ekfrequenzsCount =
    data?.data?.apById?.ekfrequenzsByApId?.totalCount ?? 0
  const filteredEkfrequenzsCount =
    data?.data?.apById?.filteredEkfrequenzs?.totalCount ?? 0
  const beobsNichtBeurteiltCount =
    data?.data?.beobsNichtBeurteilt?.totalCount ?? 0
  const filteredBeobsNichtBeurteiltCount =
    data?.data?.filteredBeobsNichtBeurteilt?.totalCount ?? 0
  const beobsNichtZuzuordnenCount =
    data?.data?.beobsNichtZuzuordnen?.totalCount ?? 0
  const filteredBeobsNichtZuzuordnenCount =
    data?.data?.filteredBeobsNichtZuzuordnen?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'projekt',
      url: `/Daten/Projekte/${projId}/Arten/${apId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Populationen',
          label: `Populationen (${isLoading ? '...' : `${popsCount}/${filteredPopsCount}`})`,
        },
        {
          id: 'AP-Ziele',
          label: `AP-Ziele Jahre (${isLoading ? '...' : `${filteredApZielJahrsCount}/${apZielJahrsCount}`})`,
        },
        {
          id: 'AP-Erfolgskriterien',
          label: `AP-Erfolgskriterien (${isLoading ? '...' : `${filteredErfkritsCount}/${erfkritsCount}`})`,
        },
        {
          id: 'Idealbiotop',
          label: `Idealbiotop`,
        },
        {
          id: 'Taxa',
          label: `Taxa (${isLoading ? '...' : `${filteredApartsCount}/${apartsCount}`})`,
        },
        {
          id: 'assoziierte-Arten',
          label: `Assoziierte Arten (${isLoading ? '...' : `${filteredAssozartsCount}/${assozartsCount}`})`,
        },
        {
          id: 'EK-Frequenzen',
          label: `EK-Frequenzen (${isLoading ? '...' : `${filteredEkfrequenzsCount}/${ekfrequenzsCount}`})`,
        },
        {
          id: 'nicht-beurteilte-Beobachtungen',
          label: `Beobachtungen nicht beurteilt (${isLoading ? '...' : `${filteredBeobsNichtBeurteiltCount}/${beobsNichtBeurteiltCount}`})`,
        },
        {
          id: 'nicht-zuzuordnende-Beobachtungen',
          label: `Beobachtungen nicht zuzuordnen (${isLoading ? '...' : `${filteredBeobsNichtZuzuordnenCount}/${beobsNichtZuzuordnenCount}`})`,
        },
        {
          id: 'Qualitaetskontrollen',
          label: `Qualitaetskontrollen`,
        },
      ],
    }),
    [
      apId,
      apZielJahrsCount,
      apartsCount,
      assozartsCount,
      beobsNichtBeurteiltCount,
      beobsNichtZuzuordnenCount,
      ekfrequenzsCount,
      erfkritsCount,
      filteredApZielJahrsCount,
      filteredApartsCount,
      filteredAssozartsCount,
      filteredBeobsNichtBeurteiltCount,
      filteredBeobsNichtZuzuordnenCount,
      filteredEkfrequenzsCount,
      filteredErfkritsCount,
      filteredPopsCount,
      isLoading,
      label,
      popsCount,
      projId,
    ],
  )

  return { isLoading, error, navData }
}
