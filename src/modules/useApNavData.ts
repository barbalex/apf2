import { apiCount, apiFetch, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { countBy } from 'es-toolkit'
import { useAtomValue } from 'jotai'
import {
  mapActiveApfloraLayersAtom,
  treePopGqlFilterForTreeAtom,
  treeBeobNichtBeurteiltGqlFilterForTreeAtom,
  treeBeobNichtZuzuordnenGqlFilterForTreeAtom,
} from '../store/index.ts'
import { getZielGqlFilterForTree } from './getZielGqlFilterForTree.ts'
import { getApberGqlFilterForTree } from './getApberGqlFilterForTree.ts'
import { getApartGqlFilterForTree } from './getApartGqlFilterForTree.ts'
import { getAssozartGqlFilterForTree } from './getAssozartGqlFilterForTree.ts'
import { getErfkritGqlFilterForTree } from './getErfkritGqlFilterForTree.ts'
import { getEkfrequenzGqlFilterForTree } from './getEkfrequenzGqlFilterForTree.ts'
import { getEkzaehleinheitGqlFilterForTree } from './getEkzaehleinheitGqlFilterForTree.ts'
import { PopMapIcon } from '../components/NavElements/PopMapIcon.tsx'
import { BeobnichtbeurteiltMapIcon } from '../components/NavElements/BeobnichtbeurteiltMapIcon.tsx'
import { BeobnichtzuzuordnenMapIcon } from '../components/NavElements/BeobnichtzuzuordnenMapIcon.tsx'
import { useProjekteTabs } from './useProjekteTabs.ts'

export const useApNavData = (
  props?:
    { projId?: string | undefined; apId?: string | undefined } | undefined,
) => {
  const projId = props?.projId ?? ''
  const apId = props?.apId ?? ''

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const popGqlFilterForTree = useAtomValue(treePopGqlFilterForTreeAtom)
  const beobNichtBeurteiltGqlFilterForTree = useAtomValue(
    treeBeobNichtBeurteiltGqlFilterForTreeAtom,
  )
  const beobNichtZuzuordnenGqlFilterForTree = useAtomValue(
    treeBeobNichtZuzuordnenGqlFilterForTreeAtom,
  )
  const showPopIcon = activeApfloraLayers?.includes('pop') && karteIsVisible
  const showBeobnichtbeurteiltIcon =
    activeApfloraLayers?.includes('beobNichtBeurteilt') && karteIsVisible
  const showBeobnichtzuzuordnenIcon =
    activeApfloraLayers?.includes('beobNichtZuzuordnen') && karteIsVisible

  const allBeobNichtZuzuordnenFilter = {
    nichtZuordnen: { equalTo: true },
  }

  const allBeobNichtBeurteiltFilter = {
    tpopId: { isNull: true },
    nichtZuordnen: { equalTo: false },
  }

  // Get filters before useQuery so changes trigger refetch
  const zielGqlFilterForTree = getZielGqlFilterForTree(apId)
  const apberGqlFilterForTree = getApberGqlFilterForTree(apId)
  const apartGqlFilterForTree = getApartGqlFilterForTree(apId)
  const assozartGqlFilterForTree = getAssozartGqlFilterForTree(apId)
  const erfkritGqlFilterForTree = getErfkritGqlFilterForTree(apId)
  const ekfrequenzGqlFilterForTree = getEkfrequenzGqlFilterForTree(apId)
  const ekzaehleinheitGqlFilterForTree = getEkzaehleinheitGqlFilterForTree(apId)

  // TODO: somehow in bookmarks where this is dynamically imported, isLoading often does not goe to false
  // but only on first load?
  const { data } = useSuspenseQuery({
    queryKey: [
      'treeAp',
      projId,
      apId,
      popGqlFilterForTree,
      zielGqlFilterForTree,
      apberGqlFilterForTree,
      apartGqlFilterForTree,
      assozartGqlFilterForTree,
      erfkritGqlFilterForTree,
      ekfrequenzGqlFilterForTree,
      ekzaehleinheitGqlFilterForTree,
      beobNichtBeurteiltGqlFilterForTree,
      beobNichtZuzuordnenGqlFilterForTree,
    ],
    queryFn: async () => {
      // phase 5: the former XByApId relation constraints merge into the
      // cascade filters; sibling keys are ANDed by compile_filter.
      // beob scoping by the ap's taxa: the old aeTaxonomyByArtId reverse
      // relation becomes an artId in-list of the ap's apart rows
      const apOf = (filter: object) => ({
        ...filter,
        apByApId: {
          ...((filter as { apByApId?: object }).apByApId ?? {}),
          id: { equalTo: apId },
        },
      })
      const aparts = await apiFetch<{ art_id: string | null }[]>(
        `/apart?ap_id=eq.${apId}&select=art_id&art_id=not.is.null`,
      )
      const artIds = (aparts ?? []).map((r) => r.art_id) as string[]
      const beobOfArt = (filter: object) => ({
        ...filter,
        artId: { in: artIds },
      })
      const [
        ap,
        qkCount,
        popsFiltered,
        popsAll,
        ziels,
        filteredZiels,
        erfkritsFiltered,
        erfkritsAll,
        apbersFiltered,
        apbersAll,
        apartsFiltered,
        apartsAll,
        assozartsFiltered,
        assozartsAll,
        ekfrequenzsFiltered,
        ekfrequenzsAll,
        ekzaehleinheitsFiltered,
        ekzaehleinheitsAll,
        filesCount,
        historiesCount,
        beobsNichtBeurteiltAll,
        beobsNichtBeurteiltFiltered,
        beobsNichtZuzuordnenAll,
        beobsNichtZuzuordnenFiltered,
      ] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/q_ap?id=eq.${apId}&select=id,label`,
        ),
        apiCount(`/apqk?ap_id=eq.${apId}`),
        rpcCount('query_pop', { p_filter: apOf(popGqlFilterForTree) }),
        apiCount(`/q_pop?ap_id=eq.${apId}`),
        apiFetch<{ id: string; jahr: number | null }[]>(
          `/q_ziel?ap_id=eq.${apId}&select=id,jahr`,
        ),
        apiFetch<{ id: string; jahr: number | null }[]>(
          '/rpc/query_ziel?select=id,jahr',
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: apOf(zielGqlFilterForTree),
            }),
          },
        ),
        rpcCount('query_erfkrit', { p_filter: apOf(erfkritGqlFilterForTree) }),
        apiCount(`/q_erfkrit?ap_id=eq.${apId}`),
        rpcCount('query_apber', { p_filter: apOf(apberGqlFilterForTree) }),
        apiCount(`/q_apber?ap_id=eq.${apId}`),
        rpcCount('query_apart', { p_filter: apOf(apartGqlFilterForTree) }),
        apiCount(`/q_apart?ap_id=eq.${apId}`),
        rpcCount('query_assozart', {
          p_filter: apOf(assozartGqlFilterForTree),
        }),
        apiCount(`/q_assozart?ap_id=eq.${apId}`),
        rpcCount('query_ekfrequenz', {
          p_filter: apOf(ekfrequenzGqlFilterForTree),
        }),
        apiCount(`/q_ekfrequenz?ap_id=eq.${apId}`),
        rpcCount('query_ekzaehleinheit', {
          p_filter: apOf(ekzaehleinheitGqlFilterForTree),
        }),
        apiCount(`/q_ekzaehleinheit?ap_id=eq.${apId}`),
        apiCount(`/ap_file?ap_id=eq.${apId}`),
        apiCount(`/v_ap_history?id=eq.${apId}`),
        rpcCount('query_beob', {
          p_filter: beobOfArt(allBeobNichtBeurteiltFilter),
        }),
        rpcCount('query_beob', {
          p_filter: beobOfArt(beobNichtBeurteiltGqlFilterForTree),
        }),
        rpcCount('query_beob', {
          p_filter: beobOfArt(allBeobNichtZuzuordnenFilter),
        }),
        rpcCount('query_beob', {
          p_filter: beobOfArt(beobNichtZuzuordnenGqlFilterForTree),
        }),
      ])
      return {
        apById: {
          id: apId,
          label: ap?.[0]?.label,
          apqksByApId: { totalCount: qkCount },
          popsByApId: { totalCount: popsAll },
          filteredPops: { totalCount: popsFiltered },
          zielsByApId: { nodes: ziels ?? [] },
          filteredZiels: { nodes: filteredZiels ?? [] },
          erfkritsByApId: { totalCount: erfkritsAll },
          filteredErfkrits: { totalCount: erfkritsFiltered },
          apbersByApId: { totalCount: apbersAll },
          filteredApbers: { totalCount: apbersFiltered },
          apartsByApId: { totalCount: apartsAll },
          filteredAparts: { totalCount: apartsFiltered },
          assozartsByApId: { totalCount: assozartsAll },
          filteredAssozarts: { totalCount: assozartsFiltered },
          ekfrequenzsByApId: { totalCount: ekfrequenzsAll },
          filteredEkfrequenzs: { totalCount: ekfrequenzsFiltered },
          ekzaehleinheitsByApId: { totalCount: ekzaehleinheitsAll },
          filteredEkzaehleinheits: { totalCount: ekzaehleinheitsFiltered },
          apFilesByApId: { totalCount: filesCount },
        },
        allApHistories: { totalCount: historiesCount },
        beobsNichtBeurteilt: { totalCount: beobsNichtBeurteiltAll },
        filteredBeobsNichtBeurteilt: {
          totalCount: beobsNichtBeurteiltFiltered,
        },
        beobsNichtZuzuordnen: { totalCount: beobsNichtZuzuordnenAll },
        filteredBeobsNichtZuzuordnen: {
          totalCount: beobsNichtZuzuordnenFiltered,
        },
      }
    },
  })

  const label = data.apById?.label
  const popsCount = data.apById?.popsByApId?.totalCount ?? 0
  const filteredPopsCount = data.apById?.filteredPops?.totalCount ?? 0
  const apZiels = data.apById?.zielsByApId?.nodes ?? []
  const apZielJahrs = countBy(apZiels, (e) => e?.jahr ?? 0)
  const apZielJahrsCount = Object.keys(apZielJahrs).length
  const filteredApZiels = data.apById?.filteredZiels?.nodes ?? []
  const filteredApZielJahrs = countBy(filteredApZiels, (e) => e?.jahr ?? 0)
  const filteredApZielJahrsCount = Object.keys(filteredApZielJahrs).length
  const erfkritsCount = data.apById?.erfkritsByApId?.totalCount ?? 0
  const filteredErfkritsCount = data.apById?.filteredErfkrits?.totalCount ?? 0
  const apbersCount = data.apById?.apbersByApId?.totalCount ?? 0
  const filteredApbersCount = data.apById?.filteredApbers?.totalCount ?? 0
  const apartsCount = data.apById?.apartsByApId?.totalCount ?? 0
  const filteredApartsCount = data.apById?.filteredAparts?.totalCount ?? 0
  const assozartsCount = data.apById?.assozartsByApId?.totalCount ?? 0
  const filteredAssozartsCount = data.apById?.filteredAssozarts?.totalCount ?? 0
  const ekfrequenzsCount = data.apById?.ekfrequenzsByApId?.totalCount ?? 0
  const filteredEkfrequenzsCount =
    data.apById?.filteredEkfrequenzs?.totalCount ?? 0
  const ekzaehleinheitsCount =
    data.apById?.ekzaehleinheitsByApId?.totalCount ?? 0
  const filteredEkzaehleinheitsCount =
    data.apById?.filteredEkzaehleinheits?.totalCount ?? 0
  const beobsNichtBeurteiltCount = data.beobsNichtBeurteilt?.totalCount ?? 0
  const filteredBeobsNichtBeurteiltCount =
    data.filteredBeobsNichtBeurteilt?.totalCount ?? 0
  const beobsNichtZuzuordnenCount = data.beobsNichtZuzuordnen?.totalCount ?? 0
  const filteredBeobsNichtZuzuordnenCount =
    data.filteredBeobsNichtZuzuordnen?.totalCount ?? 0
  const filesCount = data.apById?.apFilesByApId?.totalCount ?? 0
  const historiesCount = data.allApHistories?.totalCount ?? 0
  const qkCount = data.apById?.apqksByApId?.totalCount ?? 0

  const navData = {
    id: apId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'ap',
    singleElementName: 'Art',
    treeId: apId,
    treeTableId: apId,
    treeParentTableId: projId,
    treeUrl: ['Projekte', projId, 'Arten', apId],
    hasChildren: true,
    fetcherName: 'useApNavData',
    fetcherParams: { projId, apId },
    menus: [
      {
        id: 'Art',
        label: `Art`,
        isSelf: true,
      },
      {
        id: 'Populationen',
        label: `Populationen (${filteredPopsCount}/${popsCount})`,
        listFilter: 'pop',
        treeNodeType: 'folder',
        treeMenuType: 'popFolder',
        treeId: `${apId}PopFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Populationen'],
        fetcherName: 'usePopsNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredPopsCount,
        labelLeftElements: showPopIcon ? [PopMapIcon] : undefined,
      },
      {
        id: 'AP-Ziele',
        label: `AP-Ziele Jahre (${filteredApZielJahrsCount}/${apZielJahrsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'zielFolder',
        treeId: `${apId}ApzielFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele'],
        fetcherName: 'useZieljahrsNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredApZielJahrsCount,
      },
      {
        id: 'AP-Erfolgskriterien',
        label: `AP-Erfolgskriterien (${filteredErfkritsCount}/${erfkritsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'erfkritFolder',
        treeId: `${apId}ErfkritFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien'],
        fetcherName: 'useErfkritsNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredErfkritsCount,
      },
      {
        id: 'AP-Berichte',
        label: `AP-Berichte (${filteredApbersCount}/${apbersCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'apberFolder',
        treeId: `${apId}ApberFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Berichte'],
        fetcherName: 'useApbersNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredApbersCount,
      },
      {
        id: 'Idealbiotop',
        label: `Idealbiotop`,
        treeNodeType: 'folder',
        treeMenuType: 'idealbiotopFolder',
        treeId: `${apId}IdealbiotopFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Idealbiotop'],
        fetcherName: 'useIdealbiotopNavData',
        fetcherParams: { projId, apId },
        hasChildren: true,
      },
      {
        id: 'Taxa',
        label: `Taxa (${filteredApartsCount}/${apartsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'apartFolder',
        treeId: `${apId}ApartFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Taxa'],
        fetcherName: 'useApartsNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredApartsCount,
      },
      {
        id: 'assoziierte-Arten',
        label: `Assoziierte Arten (${filteredAssozartsCount}/${assozartsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'assozartFolder',
        treeId: `${apId}AssozartFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten'],
        fetcherName: 'useAssozartsNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredAssozartsCount,
      },
      {
        id: 'EK-Frequenzen',
        label: `EK-Frequenzen (${filteredEkfrequenzsCount}/${ekfrequenzsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'ekfrequenzFolder',
        treeId: `${apId}EkfrequenzFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen'],
        fetcherName: 'useEkfrequenzsNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredEkfrequenzsCount,
      },
      {
        id: 'EK-Zähleinheiten',
        label: `EK-Zähleinheiten (${filteredEkzaehleinheitsCount}/${ekzaehleinheitsCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'ekzaehleinheitFolder',
        treeId: `${apId}EkzaehleinheitFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten'],
        fetcherName: 'useEkzaehleinheitsNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredEkzaehleinheitsCount,
      },
      {
        id: 'nicht-beurteilte-Beobachtungen',
        label: `Beobachtungen nicht beurteilt (${filteredBeobsNichtBeurteiltCount}/${beobsNichtBeurteiltCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'beobNichtBeurteiltFolder',
        treeId: `${apId}BeobNichtBeurteiltFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'nicht-beurteilte-Beobachtungen',
        ],
        fetcherName: 'useBeobNichtBeurteiltsNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredBeobsNichtBeurteiltCount,
        labelLeftElements:
          showBeobnichtbeurteiltIcon ? [BeobnichtbeurteiltMapIcon] : undefined,
      },
      {
        id: 'nicht-zuzuordnende-Beobachtungen',
        label: `Beobachtungen nicht zuzuordnen (${filteredBeobsNichtZuzuordnenCount}/${beobsNichtZuzuordnenCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'beobNichtZuzuordnenFolder',
        treeId: `${apId}BeobNichtZuzuordnenFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'nicht-zuzuordnende-Beobachtungen',
        ],
        fetcherName: 'useBeobNichtZuzuordnensNavData',
        fetcherParams: { projId, apId },
        hasChildren: !!filteredBeobsNichtZuzuordnenCount,
        labelLeftElements:
          showBeobnichtzuzuordnenIcon ?
            [BeobnichtzuzuordnenMapIcon]
          : undefined,
      },
      {
        id: 'Qualitätskontrollen',
        label: `Qualitätskontrollen ausführen`,
        treeNodeType: 'folder',
        treeMenuType: 'qkFolder',
        treeId: `${apId}QkFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Qualitätskontrollen'],
        hasChildren: false,
      },
      {
        id: 'Qualitätskontrollen-wählen',
        label: `Qualitätskontrollen wählen (${qkCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'qkWaehlenFolder',
        treeId: `${apId}QkWaehlenFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Qualitätskontrollen-wählen',
        ],
        hasChildren: false,
      },
      {
        id: 'Auswertung',
        label: `Auswertung`,
        treeNodeType: 'folder',
        treeMenuType: 'auswertungFolder',
        treeId: `${apId}AuswertungFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Auswertung'],
        hasChildren: false,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'dateienFolder',
        treeId: `${apId}DateienFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Dateien'],
        hasChildren: false,
      },
      {
        id: 'Historien',
        label: `Historien (${historiesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'historienFolder',
        treeId: `${apId}HistorienFolder`,
        treeTableId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Historien'],
        hasChildren: false,
      },
    ],
  }

  return navData
}
