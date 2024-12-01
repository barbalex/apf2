import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useWertesNavData = (props) => {
  const apolloClient = useApolloClient()
  const include = props?.include ?? true

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeWertes',
      store.tree.adresseGqlFilterForTree,
      store.tree.tpopApberrelevantGrundWerteGqlFilterForTree,
      store.tree.ekAbrechnungstypWerteGqlFilterForTree,
      store.tree.tpopkontrzaehlEinheitWerteGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavWertesQuery(
            $adressesFilter: AdresseFilter!
            $tpopApberrelevantGrundWerteFilter: TpopApberrelevantGrundWerteFilter!
            $ekAbrechnungstypWerteFilter: EkAbrechnungstypWerteFilter!
            $tpopkontrzaehlEinheitWerteFilter: TpopkontrzaehlEinheitWerteFilter!
            $include: Boolean!
          ) {
            allAdresses @include(if: $include) {
              totalCount
            }
            filteredAdresses: allAdresses(filter: $adressesFilter)
              @include(if: $include) {
              totalCount
            }
            allTpopApberrelevantGrundWertes @include(if: $include) {
              totalCount
            }
            filteredTpopApberrelevantGrundWertes: allTpopApberrelevantGrundWertes(
              filter: $tpopApberrelevantGrundWerteFilter
            ) @include(if: $include) {
              totalCount
            }
            allEkAbrechnungstypWertes @include(if: $include) {
              totalCount
            }
            filteredEkAbrechnungstypWertes: allEkAbrechnungstypWertes(
              filter: $ekAbrechnungstypWerteFilter
            ) @include(if: $include) {
              totalCount
            }
            allTpopkontrzaehlEinheitWertes @include(if: $include) {
              totalCount
            }
            filteredTpopkontrzaehlEinheitWertes: allTpopkontrzaehlEinheitWertes(
              filter: $tpopkontrzaehlEinheitWerteFilter
            ) @include(if: $include) {
              totalCount
            }
          }
        `,
        variables: {
          adressesFilter: store.tree.adresseGqlFilterForTree,
          tpopApberrelevantGrundWerteFilter:
            store.tree.tpopApberrelevantGrundWerteGqlFilterForTree,
          ekAbrechnungstypWerteFilter:
            store.tree.ekAbrechnungstypWerteGqlFilterForTree,
          tpopkontrzaehlEinheitWerteFilter:
            store.tree.tpopkontrzaehlEinheitWerteGqlFilterForTree,
          include,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.adresseGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () =>
      reaction(
        () => store.tree.tpopApberrelevantGrundWerteGqlFilterForTree,
        refetch,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () =>
      reaction(() => store.tree.ekAbrechnungstypWerteGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () =>
      reaction(
        () => store.tree.tpopkontrzaehlEinheitWerteGqlFilterForTree,
        refetch,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const adressesCount = data?.data?.allAdresses?.totalCount ?? 0
  const adressesFilteredCount = data?.data?.filteredAdresses?.totalCount ?? 0
  const tpopApberrelevantGrundWerteCount =
    data?.data?.allTpopApberrelevantGrundWertes?.totalCount ?? 0
  const tpopApberrelevantGrundWerteFilteredCount =
    data?.data?.filteredTpopApberrelevantGrundWertes?.totalCount ?? 0
  const ekAbrechnungstypWerteCount =
    data?.data?.allEkAbrechnungstypWertes?.totalCount ?? 0
  const ekAbrechnungstypWerteFilteredCount =
    data?.data?.filteredEkAbrechnungstypWertes?.totalCount ?? 0
  const tpopkontrzaehlEinheitWerteCount =
    data?.data?.allTpopkontrzaehlEinheitWertes?.totalCount ?? 0
  const tpopkontrzaehlEinheitWerteFilteredCount =
    data?.data?.filteredTpopkontrzaehlEinheitWertes?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'WerteListen',
      url: '/Daten/Werte-Listen',
      label: `Werte-Listen`,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Adressen',
          label: `Adressen (${isLoading ? '...' : `${adressesFilteredCount}/${adressesCount}`})`,
          count: adressesCount,
        },
        {
          id: 'ApberrelevantGrundWerte',
          label: `Teil-Population: Grund für AP-Bericht Relevanz (${isLoading ? '...' : `${tpopApberrelevantGrundWerteFilteredCount}/${tpopApberrelevantGrundWerteCount}`})`,
          count: tpopApberrelevantGrundWerteCount,
        },
        {
          id: 'EkAbrechnungstypWerte',
          label: `Teil-Population: EK-Abrechnungstypen (${isLoading ? '...' : `${ekAbrechnungstypWerteFilteredCount}/${ekAbrechnungstypWerteCount}`})`,
          count: ekAbrechnungstypWerteCount,
        },
        {
          id: 'TpopkontrzaehlEinheitWerte',
          label: `Teil-Population: Zähl-Einheiten (${isLoading ? '...' : `${tpopkontrzaehlEinheitWerteFilteredCount}/${tpopkontrzaehlEinheitWerteCount}`})`,
          count: tpopkontrzaehlEinheitWerteCount,
        },
      ],
    }),
    [
      adressesCount,
      adressesFilteredCount,
      ekAbrechnungstypWerteCount,
      ekAbrechnungstypWerteFilteredCount,
      isLoading,
      tpopApberrelevantGrundWerteCount,
      tpopApberrelevantGrundWerteFilteredCount,
      tpopkontrzaehlEinheitWerteCount,
      tpopkontrzaehlEinheitWerteFilteredCount,
    ],
  )

  return { isLoading, error, navData }
}
