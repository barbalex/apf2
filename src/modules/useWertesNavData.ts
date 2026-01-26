import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import {
  store,
  treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom,
  treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
  treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom,
  treeAdresseGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useWertesNavData = () => {
  const apolloClient = useApolloClient()

  const tpopkontrzaehlEinheitWerteGqlFilterForTree = useAtomValue(
    treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom,
  )
  const ekAbrechnungstypWerteGqlFilterForTree = useAtomValue(
    treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
  )
  const tpopApberrelevantGrundWerteGqlFilterForTree = useAtomValue(
    treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom,
  )
  const adresseGqlFilterForTree = useAtomValue(treeAdresseGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: [
      'treeWertes',
      adresseGqlFilterForTree,
      tpopApberrelevantGrundWerteGqlFilterForTree,
      ekAbrechnungstypWerteGqlFilterForTree,
      tpopkontrzaehlEinheitWerteGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
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
          adressesFilter: adresseGqlFilterForTree,
          tpopApberrelevantGrundWerteFilter:
            tpopApberrelevantGrundWerteGqlFilterForTree,
          ekAbrechnungstypWerteFilter: ekAbrechnungstypWerteGqlFilterForTree,
          tpopkontrzaehlEinheitWerteFilter:
            tpopkontrzaehlEinheitWerteGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const adressesCount = data.allAdresses.totalCount
  const adressesFilteredCount = data.filteredAdresses.totalCount
  const tpopApberrelevantGrundWerteCount =
    data.allTpopApberrelevantGrundWertes.totalCount
  const tpopApberrelevantGrundWerteFilteredCount =
    data.filteredTpopApberrelevantGrundWertes.totalCount
  const ekAbrechnungstypWerteCount =
    data.allEkAbrechnungstypWertes.totalCount
  const ekAbrechnungstypWerteFilteredCount =
    data.filteredEkAbrechnungstypWertes.totalCount
  const tpopkontrzaehlEinheitWerteCount =
    data.allTpopkontrzaehlEinheitWertes.totalCount
  const tpopkontrzaehlEinheitWerteFilteredCount =
    data.filteredTpopkontrzaehlEinheitWertes.totalCount

  const navData = {
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
        label: `Adressen (${adressesFilteredCount}/${adressesCount})`,
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
        label: `Teil-Population: Grund für AP-Bericht Relevanz (${tpopApberrelevantGrundWerteFilteredCount}/${tpopApberrelevantGrundWerteCount})`,
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
        label: `Teil-Population: EK-Abrechnungstypen (${ekAbrechnungstypWerteFilteredCount}/${ekAbrechnungstypWerteCount})`,
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
        label: `Teil-Population: Zähl-Einheiten (${tpopkontrzaehlEinheitWerteFilteredCount}/${tpopkontrzaehlEinheitWerteCount})`,
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
  }

  return navData
}
