import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useTpopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpops',
      tpopId,
      store.tree.tpopmassnGqlFilterForTree,
      store.tree.tpopmassnberGqlFilterForTree,
      store.tree.tpopkontrGqlFilterForTree,
      store.tree.tpopberGqlFilterForTree,
      store.tree.beobZugeordnetGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavTpopQuery(
            $tpopId: UUID!
            $tpopmassnFilter: TpopmassnFilter!
            $tpopmassnberFilter: TpopmassnberFilter!
            $tpopfeldkontrFilter: TpopkontrFilter!
            $tpopfreiwkontrFilter: TpopkontrFilter!
            $tpopberFilter: TpopberFilter!
            $beobZugeordnetFilter: BeobFilter!
          ) {
            tpopById(id: $tpopId) {
              id
              label
              status
              tpopmassnsByTpopId {
                totalCount
              }
              filteredTpopmassns: tpopmassnsByTpopId(filter: $tpopmassnFilter) {
                totalCount
              }
              tpopmassnbersByTpopId {
                totalCount
              }
              filteredTpopmassnbers: tpopmassnbersByTpopId(
                filter: $tpopmassnberFilter
              ) {
                totalCount
              }
              tpopfeldkontrs: tpopkontrsByTpopId(
                filter: {
                  typ: { distinctFrom: "Freiwilligen-Erfolgskontrolle" }
                }
              ) {
                totalCount
              }
              filteredTpopfeldkontrs: tpopkontrsByTpopId(
                filter: $tpopfeldkontrFilter
              ) {
                totalCount
              }
              tpopfreiwkontrs: tpopkontrsByTpopId(
                filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
              ) {
                totalCount
              }
              filteredTpopfreiwkontrs: tpopkontrsByTpopId(
                filter: $tpopfreiwkontrFilter
              ) {
                totalCount
              }
              tpopbersByTpopId {
                totalCount
              }
              filteredTpopbers: tpopbersByTpopId(filter: $tpopberFilter) {
                totalCount
              }
              beobZugeordnet: beobsByTpopId(
                filter: { tpopId: { equalTo: $tpopId } }
              ) {
                totalCount
              }
              filteredBeobZugeordnet: beobsByTpopId(
                filter: $beobZugeordnetFilter
              ) {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopId,
          tpopmassnFilter: store.tree.tpopmassnGqlFilterForTree,
          tpopmassnberFilter: store.tree.tpopmassnberGqlFilterForTree,
          tpopfeldkontrFilter: {
            ...store.tree.tpopkontrGqlFilterForTree,
            typ: { distinctFrom: 'Freiwilligen-Erfolgskontrolle' },
          },
          tpopfreiwkontrFilter: {
            ...store.tree.tpopkontrGqlFilterForTree,
            typ: { equalTo: 'Freiwilligen-Erfolgskontrolle' },
          },
          tpopberFilter: store.tree.tpopberGqlFilterForTree,
          beobZugeordnetFilter: {
            ...store.tree.beobZugeordnetGqlFilterForTree,
            tpopId: { equalTo: tpopId },
          },
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.tpopmassnGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.tpopmassnberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.tpopkontrGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.tpopberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.beobZugeordnetGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.tpopById?.label
  const massnCount = data?.data?.tpopById?.tpopmassnsByTpopId?.totalCount ?? 0
  const filteredMassnCount =
    data?.data?.tpopById?.filteredTpopmassns?.totalCount ?? 0
  const popmassnbersCount =
    data?.data?.tpopById?.tpopmassnbersByTpopId?.totalCount ?? 0
  const filteredPopmassnbersCount =
    data?.data?.tpopById?.filteredTpopmassnbers?.totalCount ?? 0
  const feldkontrCount = data?.data?.tpopById?.tpopfeldkontrs?.totalCount ?? 0
  const filteredFeldkontrCount =
    data?.data?.tpopById?.filteredTpopfeldkontrs?.totalCount ?? 0
  const freiwkontrCount = data?.data?.tpopById?.tpopfreiwkontrs?.totalCount ?? 0
  const filteredFreiwkontrCount =
    data?.data?.tpopById?.filteredTpopfreiwkontrs?.totalCount ?? 0
  const tpopbersCount = data?.data?.tpopById?.tpopbersByTpopId?.totalCount ?? 0
  const filteredTpopbersCount =
    data?.data?.tpopById?.filteredTpopbers?.totalCount ?? 0
  const beobZugeordnetCount =
    data?.data?.tpopById?.beobZugeordnet?.totalCount ?? 0
  const filteredBeobZugeordnetCount =
    data?.data?.tpopById?.filteredBeobZugeordnet?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: tpopId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}`,
      label,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Massnahmen',
          label: `Massnahmen (${isLoading ? '...' : `${filteredMassnCount}/${massnCount}`})`,
          // count: massnCount,
        },
        {
          id: 'Massnahmen-Berichte',
          label: `Massnahmen-Berichte (${isLoading ? '...' : `${filteredPopmassnbersCount}/${popmassnbersCount}`})`,
          // count: popmassnbersCount,
        },
        {
          id: 'Feld-Kontrollen',
          label: `Feld-Kontrollen (${isLoading ? '...' : `${filteredFeldkontrCount}/${feldkontrCount}`})`,
          // count: feldkontrCount,
        },
        {
          id: 'Freiwilligen-Kontrollen',
          label: `Freiwilligen-Kontrollen (${isLoading ? '...' : `${filteredFreiwkontrCount}/${freiwkontrCount}`})`,
          // count: freiwkontrCount,
        },
        {
          id: 'Kontroll-Berichte',
          label: `Kontroll-Berichte (${isLoading ? '...' : `${filteredTpopbersCount}/${tpopbersCount}`})`,
          // count: tpopbersCount,
        },
        {
          id: 'Beobachtungen',
          label: `Beobachtungen zugeordnet (${isLoading ? '...' : `${filteredBeobZugeordnetCount}/${beobZugeordnetCount}`})`,
          // count: beobZugeordnetCount,
        },
      ],
    }),
    [
      apId,
      beobZugeordnetCount,
      feldkontrCount,
      filteredBeobZugeordnetCount,
      filteredFeldkontrCount,
      filteredFreiwkontrCount,
      filteredMassnCount,
      filteredPopmassnbersCount,
      filteredTpopbersCount,
      freiwkontrCount,
      isLoading,
      label,
      massnCount,
      popId,
      popmassnbersCount,
      projId,
      tpopId,
      tpopbersCount,
    ],
  )

  return { isLoading, error, navData }
}
