import { useMemo, useContext, useEffect, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'
import countBy from 'lodash/countBy'

import { MobxContext } from '../mobxContext.js'
import { PopMapIcon } from '../components/NavElements/PopMapIcon.jsx'
import { BeobnichtbeurteiltMapIcon } from '../components/NavElements/BeobnichtbeurteiltMapIcon.jsx'
import { BeobnichtzuzuordnenMapIcon } from '../components/NavElements/BeobnichtzuzuordnenMapIcon.jsx'
import { useProjekteTabs } from './useProjekteTabs.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.jsx'

export const useApNavData = (props) => {
  const apolloClient = useApolloClient()
  const { projId, apId: apIdFromParams } = useParams()
  const apId = props?.apId ?? apIdFromParams

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const store = useContext(MobxContext)

  const showPopIcon =
    store.activeApfloraLayers?.includes('pop') && karteIsVisible
  const showBeobnichtbeurteiltIcon =
    store.activeApfloraLayers?.includes('beobNichtBeurteilt') && karteIsVisible
  const showBeobnichtzuzuordnenIcon =
    store.activeApfloraLayers?.includes('beobNichtZuzuordnen') && karteIsVisible
  const [, setRerenderer] = useState(0)
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])

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
              apFilesByApId {
                totalCount
              }
            }
            allApHistories(filter: { id: { equalTo: $apId } }) {
              totalCount
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
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
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
  const filesCount = data?.data?.apById?.apFilesByApId?.totalCount ?? 0
  const historiesCount = data?.data?.allApHistories?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: apId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}`,
      label,
      treeNodeType: 'table',
      treeMenuType: 'ap',
      singleElementName: 'Art',
      treeId: apId,
      treeParentId: projId,
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
          label: `Populationen (${isLoading ? '...' : `${filteredPopsCount}/${popsCount}`})`,
          listFilter: 'pop',
          treeNodeType: 'folder',
          treeMenuType: 'popFolder',
          treeId: `${apId}PopFolder`,
          treeTableId: apId,
          treeParentId: apId,
          treeParentTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'Populationen'],
          fetcherName: 'usePopsNavData',
          fetcherParams: { projId, apId },
          hasChildren: !!filteredPopsCount,
          labelLeftElements: showPopIcon ? [PopMapIcon] : undefined,
          component: NodeWithList,
        },
        {
          id: 'AP-Ziele',
          label: `AP-Ziele Jahre (${isLoading ? '...' : `${filteredApZielJahrsCount}/${apZielJahrsCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'zielFolder',
          treeId: `${apId}ApzielFolder`,
          treeTableId: apId,
          treeParentId: apId,
          treeParentTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele'],
          fetcherName: 'useZieljahrsNavData',
          fetcherParams: { projId, apId },
          hasChildren: !!filteredApZielJahrsCount,
          component: NodeWithList,
        },
        {
          id: 'AP-Erfolgskriterien',
          label: `AP-Erfolgskriterien (${isLoading ? '...' : `${filteredErfkritsCount}/${erfkritsCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'erfkritFolder',
          treeId: `${apId}ErfkritFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Erfolgskriterien'],
          fetcherName: 'useErfkritsNavData',
          fetcherParams: { projId, apId },
          hasChildren: !!filteredErfkritsCount,
          component: NodeWithList,
        },
        {
          id: 'AP-Berichte',
          label: `AP-Berichte (${isLoading ? '...' : `${filteredApbersCount}/${apbersCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'apberFolder',
          treeId: `${apId}ApberFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Berichte'],
          fetcherName: 'useApbersNavData',
          fetcherParams: { projId, apId },
          hasChildren: !!filteredApbersCount,
          component: NodeWithList,
        },
        {
          id: 'Idealbiotop',
          label: `Idealbiotop`,
          treeNodeType: 'folder',
          treeMenuType: 'idealbiotopFolder',
          treeId: `${apId}IdealbiotopFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'Idealbiotop'],
          fetcherName: 'useIdealbiotopNavData',
          fetcherParams: { projId, apId },
          hasChildren: true,
          component: Node,
        },
        {
          id: 'Taxa',
          label: `Taxa (${isLoading ? '...' : `${filteredApartsCount}/${apartsCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'apartFolder',
          treeId: `${apId}ApartFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'Taxa'],
          fetcherName: 'useApartsNavData',
          fetcherParams: { projId, apId },
          hasChildren: !!filteredApartsCount,
          component: NodeWithList,
        },
        {
          id: 'assoziierte-Arten',
          label: `Assoziierte Arten (${isLoading ? '...' : `${filteredAssozartsCount}/${assozartsCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'assozartFolder',
          treeId: `${apId}AssozartFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten'],
          fetcherName: 'useAssozartsNavData',
          fetcherParams: { projId, apId },
          hasChildren: !!filteredAssozartsCount,
          component: NodeWithList,
        },
        {
          id: 'EK-Frequenzen',
          label: `EK-Frequenzen (${isLoading ? '...' : `${filteredEkfrequenzsCount}/${ekfrequenzsCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'ekfrequenzFolder',
          treeId: `${apId}EkfrequenzFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Frequenzen'],
          fetcherName: 'useEkfrequenzsNavData',
          fetcherParams: { projId, apId },
          hasChildren: !!filteredEkfrequenzsCount,
          component: NodeWithList,
        },
        {
          id: 'EK-Zähleinheiten',
          label: `EK-Zähleinheiten (${isLoading ? '...' : `${filteredEkzaehleinheitsCount}/${ekzaehleinheitsCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'ekzaehleinheitFolder',
          treeId: `${apId}EkzaehleinheitFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'EK-Zähleinheiten'],
          fetcherName: 'useEkzaehleinheitsNavData',
          fetcherParams: { projId, apId },
          hasChildren: !!filteredEkzaehleinheitsCount,
          component: NodeWithList,
        },
        {
          id: 'nicht-beurteilte-Beobachtungen',
          label: `Beobachtungen nicht beurteilt (${isLoading ? '...' : `${filteredBeobsNichtBeurteiltCount}/${beobsNichtBeurteiltCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'beobNichtBeurteiltFolder',
          treeId: `${apId}BeobNichtBeurteiltFolder`,
          treeTableId: apId,
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
          labelLeftElements: showBeobnichtbeurteiltIcon
            ? [BeobnichtbeurteiltMapIcon]
            : undefined,
          component: NodeWithList,
        },
        {
          id: 'nicht-zuzuordnende-Beobachtungen',
          label: `Beobachtungen nicht zuzuordnen (${isLoading ? '...' : `${filteredBeobsNichtZuzuordnenCount}/${beobsNichtZuzuordnenCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'beobNichtZuzuordnenFolder',
          treeId: `${apId}BeobNichtZuzuordnenFolder`,
          treeTableId: apId,
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
          labelLeftElements: showBeobnichtzuzuordnenIcon
            ? [BeobnichtzuzuordnenMapIcon]
            : undefined,
          component: NodeWithList,
        },
        {
          id: 'Qualitätskontrollen',
          label: `Qualitätskontrollen ausführen`,
          treeNodeType: 'folder',
          treeMenuType: 'qkFolder',
          treeId: `${apId}QkFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'Qualitätskontrollen'],
          hasChildren: false,
          component: Node,
        },
        {
          id: 'Qualitätskontrollen-wählen',
          label: `Qualitätskontrollen wählen`,
          treeNodeType: 'folder',
          treeMenuType: 'qkWaehlenFolder',
          treeId: `${apId}QkWaehlenFolder`,
          treeTableId: apId,
          treeUrl: [
            'Projekte',
            projId,
            'Arten',
            apId,
            'Qualitätskontrollen-wählen',
          ],
          hasChildren: false,
          component: Node,
        },
        {
          id: 'Auswertung',
          label: `Auswertung`,
          treeNodeType: 'folder',
          treeMenuType: 'auswertungFolder',
          treeId: `${apId}AuswertungFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'Auswertung'],
          hasChildren: false,
          component: Node,
        },
        {
          id: 'Dateien',
          label: `Dateien (${filesCount})`,
          treeNodeType: 'folder',
          treeMenuType: 'dateienFolder',
          treeId: `${apId}DateienFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'Dateien'],
          hasChildren: false,
          component: Node,
        },
        {
          id: 'Historien',
          label: `Historien (${historiesCount})`,
          treeNodeType: 'folder',
          treeMenuType: 'historienFolder',
          treeId: `${apId}HistorienFolder`,
          treeTableId: apId,
          treeUrl: ['Projekte', projId, 'Arten', apId, 'Historien'],
          hasChildren: false,
          component: Node,
        },
      ],
    }),
    [
      apId,
      projId,
      label,
      isLoading,
      filteredPopsCount,
      popsCount,
      showPopIcon,
      filteredApZielJahrsCount,
      apZielJahrsCount,
      filteredErfkritsCount,
      erfkritsCount,
      filteredApbersCount,
      apbersCount,
      filteredApartsCount,
      apartsCount,
      filteredAssozartsCount,
      assozartsCount,
      filteredEkfrequenzsCount,
      ekfrequenzsCount,
      filteredEkzaehleinheitsCount,
      ekzaehleinheitsCount,
      filteredBeobsNichtBeurteiltCount,
      beobsNichtBeurteiltCount,
      showBeobnichtbeurteiltIcon,
      filteredBeobsNichtZuzuordnenCount,
      beobsNichtZuzuordnenCount,
      showBeobnichtzuzuordnenIcon,
      filesCount,
      historiesCount,
    ],
  )

  return { isLoading, error, navData }
}
