import { useMemo, useEffect, useContext } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useWertesNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)

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
      treeNodeType: 'folder',
      treeMenuType: 'projekt',
      treeUrl: ['Werte-Listen'],
      hasChildren: true,
      fetcherName: 'useWertesNavData',
      fetcherParams: {},
      component: NodeWithList,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Adressen',
          label: `Adressen (${isLoading ? '...' : `${adressesFilteredCount}/${adressesCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'adresseFolder',
          treeId: `AdresseFolder`,
          treeUrl: ['Werte-Listen', 'Adressen'],
          hasChildren: !!adressesFilteredCount,
          fetcherName: 'useAdressesNavData',
          fetcherParams: {},
          component: NodeWithList,
        },
        {
          id: 'ApberrelevantGrundWerte',
          label: `Teil-Population: Grund für AP-Bericht Relevanz (${isLoading ? '...' : `${tpopApberrelevantGrundWerteFilteredCount}/${tpopApberrelevantGrundWerteCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'tpopApberrelevantGrundWerteFolder',
          treeId: `tpopApberrelevantGrundWerteFolder`,
          treeUrl: ['Werte-Listen', 'ApberrelevantGrundWerte'],
          hasChildren: !!tpopApberrelevantGrundWerteFilteredCount,
          fetcherName: 'useTpopApberrelevantGrundWertesNavData',
          fetcherParams: {},
          component: NodeWithList,
        },
        {
          id: 'EkAbrechnungstypWerte',
          label: `Teil-Population: EK-Abrechnungstypen (${isLoading ? '...' : `${ekAbrechnungstypWerteFilteredCount}/${ekAbrechnungstypWerteCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'ekAbrechnungstypWerteFolder',
          treeId: `EkAbrechnungstypWerteFolder`,
          treeUrl: ['Werte-Listen', 'EkAbrechnungstypWerte'],
          hasChildren: !!ekAbrechnungstypWerteFilteredCount,
          fetcherName: 'useEkAbrechnungstypWertesNavData',
          fetcherParams: {},
          component: NodeWithList,
        },
        {
          id: 'TpopkontrzaehlEinheitWerte',
          label: `Teil-Population: Zähl-Einheiten (${isLoading ? '...' : `${tpopkontrzaehlEinheitWerteFilteredCount}/${tpopkontrzaehlEinheitWerteCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'TpopkontrzaehlEinheitWerte',
          treeId: `tpopkontrzaehlEinheitWerteFolder`,
          treeUrl: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
          hasChildren: !!tpopkontrzaehlEinheitWerteFilteredCount,
          fetcherName: 'useTpopkontrzaehlEinheitWertesNavData',
          fetcherParams: {},
          component: NodeWithList,
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
