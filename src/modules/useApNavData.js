import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'
import countBy from 'lodash/countBy'

import { MobxContext } from '../mobxContext.js'

export const useApNavData = (props) => {
  const apolloClient = useApolloClient()
  const { projId, apId: apIdFromParams } = useParams()
  const apId = props?.apId ?? apIdFromParams

  const store = useContext(MobxContext)

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
      'treeAp',
      projId,
      apId,
      store.tree.popGqlFilterForTree,
      store.tree.zielGqlFilterForTree,
      store.tree.erfkritGqlFilterForTree,
      store.tree.apberGqlFilterForTree,
      store.tree.apartGqlFilterForTree,
      store.tree.assozartGqlFilterForTree,
      store.tree.ekfrequenzGqlFilterForTree,
      store.tree.ekzaehleinheitGqlFilterForTree,
      store.tree.beobNichtBeurteiltGqlFilterForTree,
      store.tree.beobNichtZuzuordnenGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavApQuery(
            $apId: UUID!
            $popFilter: PopFilter!
            $zielFilter: ZielFilter!
            $erfkritFilter: ErfkritFilter!
            $apberFilter: ApberFilter!
            $apartFilter: ApartFilter!
            $assozartFilter: AssozartFilter!
            $ekfrequenzFilter: EkfrequenzFilter!
            $ekzaehleinheitFilter: EkzaehleinheitFilter!
            $beobNichtBeurteiltFilter: BeobFilter!
            $beobNichtZuzuordnenFilter: BeobFilter!
            $allBeobNichtZuzuordnenFilter: BeobFilter!
            $allBeobNichtBeurteiltFilter: BeobFilter!
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
              apbersByApId {
                totalCount
              }
              filteredApbers: apbersByApId(filter: $apberFilter) {
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
              ekzaehleinheitsByApId {
                totalCount
              }
              filteredEkzaehleinheits: ekzaehleinheitsByApId(
                filter: $ekzaehleinheitFilter
              ) {
                totalCount
              }
            }
            beobsNichtBeurteilt: allBeobs(
              filter: $allBeobNichtBeurteiltFilter
            ) {
              totalCount
            }
            filteredBeobsNichtBeurteilt: allBeobs(
              filter: $beobNichtBeurteiltFilter
            ) {
              totalCount
            }
            beobsNichtZuzuordnen: allBeobs(
              filter: $allBeobNichtZuzuordnenFilter
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
          apberFilter: store.tree.apberGqlFilterForTree,
          apartFilter: store.tree.apartGqlFilterForTree,
          assozartFilter: store.tree.assozartGqlFilterForTree,
          ekfrequenzFilter: store.tree.ekfrequenzGqlFilterForTree,
          ekzaehleinheitFilter: store.tree.ekzaehleinheitGqlFilterForTree,
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
          allBeobNichtBeurteiltFilter,
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
    () => reaction(() => store.tree.apberGqlFilterForTree, refetch),
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
    () => reaction(() => store.tree.ekzaehleinheitGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () =>
      reaction(() => store.tree.beobNichtBeurteiltGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () =>
      reaction(() => store.tree.beobNichtZuzuordnenGqlFilterForTree, refetch),
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
  const apbersCount = data?.data?.apById?.apbersByApId?.totalCount ?? 0
  const filteredApbersCount =
    data?.data?.apById?.filteredApbers?.totalCount ?? 0
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
  const ekzaehleinheitsCount =
    data?.data?.apById?.ekzaehleinheitsByApId?.totalCount ?? 0
  const filteredEkzaehleinheitsCount =
    data?.data?.apById?.filteredEkzaehleinheits?.totalCount ?? 0
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
      id: apId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Populationen',
          label: `Populationen (${isLoading ? '...' : `${filteredPopsCount}/${popsCount}`})`,
          count: popsCount,
        },
        {
          id: 'AP-Ziele',
          label: `AP-Ziele Jahre (${isLoading ? '...' : `${filteredApZielJahrsCount}/${apZielJahrsCount}`})`,
          count: apZielJahrsCount,
        },
        {
          id: 'AP-Erfolgskriterien',
          label: `AP-Erfolgskriterien (${isLoading ? '...' : `${filteredErfkritsCount}/${erfkritsCount}`})`,
          count: erfkritsCount,
        },
        {
          id: 'AP-Berichte',
          label: `AP-Berichte (${isLoading ? '...' : `${filteredApbersCount}/${apbersCount}`})`,
          count: apbersCount,
        },
        {
          id: 'Idealbiotop',
          label: `Idealbiotop`,
        },
        {
          id: 'Taxa',
          label: `Taxa (${isLoading ? '...' : `${filteredApartsCount}/${apartsCount}`})`,
          count: apartsCount,
        },
        {
          id: 'assoziierte-Arten',
          label: `Assoziierte Arten (${isLoading ? '...' : `${filteredAssozartsCount}/${assozartsCount}`})`,
          count: assozartsCount,
        },
        {
          id: 'EK-Frequenzen',
          label: `EK-Frequenzen (${isLoading ? '...' : `${filteredEkfrequenzsCount}/${ekfrequenzsCount}`})`,
          count: ekfrequenzsCount,
        },
        {
          id: 'EK-Zähleinheiten',
          label: `EK-Zähleinheiten (${isLoading ? '...' : `${filteredEkzaehleinheitsCount}/${ekzaehleinheitsCount}`})`,
          count: ekzaehleinheitsCount,
        },
        {
          id: 'nicht-beurteilte-Beobachtungen',
          label: `Beobachtungen nicht beurteilt (${isLoading ? '...' : `${filteredBeobsNichtBeurteiltCount}/${beobsNichtBeurteiltCount}`})`,
          count: beobsNichtBeurteiltCount,
        },
        {
          id: 'nicht-zuzuordnende-Beobachtungen',
          label: `Beobachtungen nicht zuzuordnen (${isLoading ? '...' : `${filteredBeobsNichtZuzuordnenCount}/${beobsNichtZuzuordnenCount}`})`,
          count: beobsNichtZuzuordnenCount,
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
      apbersCount,
      assozartsCount,
      beobsNichtBeurteiltCount,
      beobsNichtZuzuordnenCount,
      ekfrequenzsCount,
      ekzaehleinheitsCount,
      erfkritsCount,
      filteredApZielJahrsCount,
      filteredApartsCount,
      filteredApbersCount,
      filteredAssozartsCount,
      filteredBeobsNichtBeurteiltCount,
      filteredBeobsNichtZuzuordnenCount,
      filteredEkfrequenzsCount,
      filteredEkzaehleinheitsCount,
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
