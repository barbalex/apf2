import { apiCount, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'

import {
  treeTpopkontrzaehlEinheitWerteGqlFilterForTreeAtom,
  treeEkAbrechnungstypWerteGqlFilterForTreeAtom,
  treeTpopApberrelevantGrundWerteGqlFilterForTreeAtom,
  treeAdresseGqlFilterForTreeAtom,
} from '../store/index.ts'

export const useWertesNavData = () => {
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

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeWertes',
      adresseGqlFilterForTree,
      tpopApberrelevantGrundWerteGqlFilterForTree,
      ekAbrechnungstypWerteGqlFilterForTree,
      tpopkontrzaehlEinheitWerteGqlFilterForTree,
    ],
    queryFn: async () => {
      const [
        adressesCount,
        adressesFilteredCount,
        tpopApberrelevantGrundWerteCount,
        tpopApberrelevantGrundWerteFilteredCount,
        ekAbrechnungstypWerteCount,
        ekAbrechnungstypWerteFilteredCount,
        tpopkontrzaehlEinheitWerteCount,
        tpopkontrzaehlEinheitWerteFilteredCount,
      ] = await Promise.all([
        apiCount('/q_adresse'),
        rpcCount('query_adresse', { p_filter: adresseGqlFilterForTree }),
        apiCount('/q_tpop_apberrelevant_grund_werte'),
        rpcCount('query_tpop_apberrelevant_grund_werte', {
          p_filter: tpopApberrelevantGrundWerteGqlFilterForTree,
        }),
        apiCount('/q_ek_abrechnungstyp_werte'),
        rpcCount('query_ek_abrechnungstyp_werte', {
          p_filter: ekAbrechnungstypWerteGqlFilterForTree,
        }),
        apiCount('/q_tpopkontrzaehl_einheit_werte'),
        rpcCount('query_tpopkontrzaehl_einheit_werte', {
          p_filter: tpopkontrzaehlEinheitWerteGqlFilterForTree,
        }),
      ])
      return {
        allAdresses: { totalCount: adressesCount },
        filteredAdresses: { totalCount: adressesFilteredCount },
        allTpopApberrelevantGrundWertes: {
          totalCount: tpopApberrelevantGrundWerteCount,
        },
        filteredTpopApberrelevantGrundWertes: {
          totalCount: tpopApberrelevantGrundWerteFilteredCount,
        },
        allEkAbrechnungstypWertes: { totalCount: ekAbrechnungstypWerteCount },
        filteredEkAbrechnungstypWertes: {
          totalCount: ekAbrechnungstypWerteFilteredCount,
        },
        allTpopkontrzaehlEinheitWertes: {
          totalCount: tpopkontrzaehlEinheitWerteCount,
        },
        filteredTpopkontrzaehlEinheitWertes: {
          totalCount: tpopkontrzaehlEinheitWerteFilteredCount,
        },
      }
    },
  })

  const adressesCount = data.allAdresses?.totalCount
  const adressesFilteredCount = data.filteredAdresses?.totalCount
  const tpopApberrelevantGrundWerteCount =
    data.allTpopApberrelevantGrundWertes?.totalCount
  const tpopApberrelevantGrundWerteFilteredCount =
    data.filteredTpopApberrelevantGrundWertes?.totalCount
  const ekAbrechnungstypWerteCount = data.allEkAbrechnungstypWertes?.totalCount
  const ekAbrechnungstypWerteFilteredCount =
    data.filteredEkAbrechnungstypWertes?.totalCount
  const tpopkontrzaehlEinheitWerteCount =
    data.allTpopkontrzaehlEinheitWertes?.totalCount
  const tpopkontrzaehlEinheitWerteFilteredCount =
    data.filteredTpopkontrzaehlEinheitWertes?.totalCount

  const navData = {
    id: 'WerteListen',
    treeTableId: null,
    url: '/Daten/Werte-Listen',
    label: `Werte-Listen`,
    treeNodeType: 'folder',
    treeMenuType: 'projekt',
    treeUrl: ['Werte-Listen'],
    hasChildren: true,
    fetcherName: 'useWertesNavData',
    fetcherParams: {},
    // leave totalCount undefined as the menus are folders
    menus: [
      {
        id: 'Adressen',
        label: `Adressen (${adressesFilteredCount}/${adressesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'adresseFolder',
        treeId: `AdresseFolder`,
        treeTableId: null,
        treeUrl: ['Werte-Listen', 'Adressen'],
        hasChildren: !!adressesFilteredCount,
        fetcherName: 'useAdressesNavData',
        fetcherParams: {},
      },
      {
        id: 'ApberrelevantGrundWerte',
        label: `Teil-Population: Grund für AP-Bericht Relevanz (${tpopApberrelevantGrundWerteFilteredCount}/${tpopApberrelevantGrundWerteCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopApberrelevantGrundWerteFolder',
        treeId: `tpopApberrelevantGrundWerteFolder`,
        treeTableId: null,
        treeUrl: ['Werte-Listen', 'ApberrelevantGrundWerte'],
        hasChildren: !!tpopApberrelevantGrundWerteFilteredCount,
        fetcherName: 'useTpopApberrelevantGrundWertesNavData',
        fetcherParams: {},
      },
      {
        id: 'EkAbrechnungstypWerte',
        label: `Teil-Population: EK-Abrechnungstypen (${ekAbrechnungstypWerteFilteredCount}/${ekAbrechnungstypWerteCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'ekAbrechnungstypWerteFolder',
        treeId: `EkAbrechnungstypWerteFolder`,
        treeTableId: null,
        treeUrl: ['Werte-Listen', 'EkAbrechnungstypWerte'],
        hasChildren: !!ekAbrechnungstypWerteFilteredCount,
        fetcherName: 'useEkAbrechnungstypWertesNavData',
        fetcherParams: {},
      },
      {
        id: 'TpopkontrzaehlEinheitWerte',
        label: `Teil-Population: Zähl-Einheiten (${tpopkontrzaehlEinheitWerteFilteredCount}/${tpopkontrzaehlEinheitWerteCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'TpopkontrzaehlEinheitWerte',
        treeId: `tpopkontrzaehlEinheitWerteFolder`,
        treeTableId: null,
        treeUrl: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
        hasChildren: !!tpopkontrzaehlEinheitWerteFilteredCount,
        fetcherName: 'useTpopkontrzaehlEinheitWertesNavData',
        fetcherParams: {},
      },
    ],
  }

  return navData
}
