import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useWertesNavData = () => {
  const apolloClient = useApolloClient()

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
          query NavRootQuery(
            $adressesFilter: AdresseFilter!
            $tpopApberrelevantGrundWerteFilter: TpopApberrelevantGrundWerteFilter!
            $ekAbrechnungstypWerteFilter: EkAbrechnungstypWerteFilter!
            $tpopkontrzaehlEinheitWerteFilter: TpopkontrzaehlEinheitWerteFilter!
          ) {
            allAdresses {
              totalCount
            }
            filteredAdresses: allAdresses(filter: $adressesFilter) {
              totalCount
            }
            allTpopApberrelevantGrundWertes {
              totalCount
            }
            filteredTpopApberrelevantGrundWertes: allTpopApberrelevantGrundWertes(
              filter: $tpopApberrelevantGrundWerteFilter
            ) {
              totalCount
            }
            allEkAbrechnungstypWertes {
              totalCount
            }
            filteredEkAbrechnungstypWertes: allEkAbrechnungstypWertes(
              filter: $ekAbrechnungstypWerteFilter
            ) {
              totalCount
            }
            allTpopkontrzaehlEinheitWertes {
              totalCount
            }
            filteredTpopkontrzaehlEinheitWertes: allTpopkontrzaehlEinheitWertes(
              filter: $tpopkontrzaehlEinheitWerteFilter
            ) {
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
          label: `Adressen (${adressesFilteredCount}/${adressesCount})`,
        },
        {
          id: 'ApberrelevantGrundWerte',
          label: `Teil-Population: Grund für AP-Bericht Relevanz (${tpopApberrelevantGrundWerteFilteredCount}/${tpopApberrelevantGrundWerteCount})`,
        },
        {
          id: 'EkAbrechnungstypWerte',
          label: `Teil-Population: EK-Abrechnungstypen (${ekAbrechnungstypWerteFilteredCount}/${ekAbrechnungstypWerteCount})`,
        },
        {
          id: 'TpopkontrzaehlEinheitWerte',
          label: `Teil-Population: Zähl-Einheiten (${tpopkontrzaehlEinheitWerteFilteredCount}/${tpopkontrzaehlEinheitWerteCount})`,
        },
      ],
    }),
    [
      adressesCount,
      adressesFilteredCount,
      ekAbrechnungstypWerteCount,
      ekAbrechnungstypWerteFilteredCount,
      tpopApberrelevantGrundWerteCount,
      tpopApberrelevantGrundWerteFilteredCount,
      tpopkontrzaehlEinheitWerteCount,
      tpopkontrzaehlEinheitWerteFilteredCount,
    ],
  )

  return { isLoading, error, navData }
}
