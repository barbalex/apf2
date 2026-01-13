import { useContext, useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { BeobzugeordnetMapIcon } from '../components/NavElements/BeobzugeordnetMapIcon.jsx'
import { useProjekteTabs } from './useProjekteTabs.js'

import { TpopIconQHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/qHighlighted.tsx'
import { TpopIconQ } from '../components/Projekte/Karte/layers/Tpop/statusGroup/q.tsx'
import { tpopIcons } from './useTpopsNavData.js'
import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.jsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.tsx'

const getLabelRightElements = ({ movingId, copyingId, tpopId }) => {
  const labelRightElements = []
  const isMoving = movingId === tpopId
  if (isMoving) {
    labelRightElements.push(MovingIcon)
  }
  const isCopying = copyingId === tpopId
  if (isCopying) {
    labelRightElements.push(CopyingIcon)
  }

  return labelRightElements
}

export const useTpopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const store = useContext(MobxContext)

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const showBeobzugeordnetIcon =
    store.activeApfloraLayers?.includes('beobZugeordnet') && karteIsVisible
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpop',
      tpopId,
      store.tree.tpopmassnGqlFilterForTree,
      store.tree.tpopmassnberGqlFilterForTree,
      store.tree.ekGqlFilterForTree,
      store.tree.ekfGqlFilterForTree,
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
              tpopFilesByTpopId {
                totalCount
              }
            }
            allTpopHistories(filter: { id: { equalTo: $tpopId } }) {
              totalCount
            }
          }
        `,
        variables: {
          tpopId,
          tpopmassnFilter: store.tree.tpopmassnGqlFilterForTree,
          tpopmassnberFilter: store.tree.tpopmassnberGqlFilterForTree,
          tpopfeldkontrFilter: store.tree.ekGqlFilterForTree,
          tpopfreiwkontrFilter: store.tree.ekfGqlFilterForTree,
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
    () => reaction(() => store.tree.ekGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.ekfGqlFilterForTree, refetch),
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
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.map.tpopIcon, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.showTpopIcon, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.moving.id, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.copying.id, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.tpopById?.label
  const status = data?.data?.tpopById?.status
  const massnCount = data?.data?.tpopById?.tpopmassnsByTpopId?.totalCount ?? 0
  const filteredMassnCount =
    data?.data?.tpopById?.filteredTpopmassns?.totalCount ?? 0
  const popmassnbersCount =
    data?.data?.tpopById?.tpopmassnbersByTpopId?.totalCount ?? 0
  const filteredTpopmassnbersCount =
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
  const filesCount = data?.data?.tpopById?.tpopFilesByTpopId?.totalCount ?? 0
  const historiesCount = data?.data?.allTpopHistories?.totalCount ?? 0

  const tpopIconName = store.map.tpopIcon

  const tpopIconIsHighlighted = props?.tpopId === params.tpopId
  const TpopIcon =
    status ?
      tpopIconIsHighlighted ? tpopIcons[tpopIconName][status + 'Highlighted']
      : tpopIcons[tpopIconName][status]
    : tpopIconIsHighlighted ? TpopIconQHighlighted
    : TpopIconQ

  const labelRightElements = getLabelRightElements({
    movingId: store.moving.id,
    copyingId: store.copying.id,
    tpopId,
  })

  const navData = {
    id: tpopId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'tpop',
    treeId: tpopId,
    treeParentTableId: popId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Teil-Populationen',
      tpopId,
    ],
    fetcherName: 'useTpopNavData',
    fetcherParams: { projId, apId, popId, tpopId },
    hasChildren: true,
    // TODO: show only if map is visible and tpop layer active
    labelLeftElements: store.tree.showTpopIcon ? [TpopIcon] : undefined,
    labelRightElements:
      labelRightElements.length ? labelRightElements : undefined,
    component: NodeWithList,
    menus: [
      {
        id: 'Teil-Population',
        label: `Teil-Population`,
        isSelf: true,
        labelLeftElements: store.tree.showTpopIcon ? [TpopIcon] : undefined,
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      },
      {
        id: 'Massnahmen',
        label: `Massnahmen (${isLoading ? '...' : `${filteredMassnCount}/${massnCount}`})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopmassnFolder',
        treeId: `${tpopId}TpopmassnFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Massnahmen',
        ],
        fetcherName: 'useTpopmassnsNavData',
        fetcherParams: { projId, apId, popId, tpopId },
        hasChildren: !!filteredMassnCount,
        component: NodeWithList,
      },
      {
        id: 'Massnahmen-Berichte',
        label: `Massnahmen-Berichte (${isLoading ? '...' : `${filteredTpopmassnbersCount}/${popmassnbersCount}`})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopmassnberFolder',
        treeId: `${tpopId}MassnberFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Massnahmen-Berichte',
        ],
        fetcherName: 'useTpopmassnbersNavData',
        fetcherParams: { projId, apId, popId, tpopId },
        hasChildren: !!filteredTpopmassnbersCount,
        component: NodeWithList,
      },
      {
        id: 'Feld-Kontrollen',
        label: `Feld-Kontrollen (${isLoading ? '...' : `${filteredFeldkontrCount}/${feldkontrCount}`})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopfeldkontrFolder',
        treeId: `${tpopId}FeldkontrFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Feld-Kontrollen',
        ],
        fetcherName: 'useTpopfeldkontrsNavData',
        fetcherParams: { projId, apId, popId, tpopId },
        hasChildren: !!filteredFeldkontrCount,
      },
      {
        id: 'Freiwilligen-Kontrollen',
        label: `Freiwilligen-Kontrollen (${isLoading ? '...' : `${filteredFreiwkontrCount}/${freiwkontrCount}`})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopfreiwkontrFolder',
        treeId: `${tpopId}FreiwkontrFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Freiwilligen-Kontrollen',
        ],
        fetcherName: 'useTpopfreiwkontrsNavData',
        fetcherParams: { projId, apId, popId, tpopId },
        hasChildren: !!filteredFreiwkontrCount,
      },
      {
        id: 'Kontroll-Berichte',
        label: `Kontroll-Berichte (${isLoading ? '...' : `${filteredTpopbersCount}/${tpopbersCount}`})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopberFolder',
        treeId: `${tpopId}TpopberFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Kontroll-Berichte',
        ],
        fetcherName: 'useTpopbersNavData',
        fetcherParams: { projId, apId, popId, tpopId },
        hasChildren: !!filteredTpopbersCount,
        component: NodeWithList,
      },
      {
        id: 'Beobachtungen',
        label: `Beobachtungen zugeordnet (${isLoading ? '...' : `${filteredBeobZugeordnetCount}/${beobZugeordnetCount}`})`,
        treeNodeType: 'folder',
        treeMenuType: 'beobZugeordnetFolder',
        treeId: `${tpopId}BeobZugeordnetFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Beobachtungen',
        ],
        fetcherName: 'useBeobZugeordnetsNavData',
        fetcherParams: { projId, apId, popId, tpopId },
        hasChildren: !!filteredBeobZugeordnetCount,
        labelLeftElements:
          showBeobzugeordnetIcon ? [BeobzugeordnetMapIcon] : undefined,
        component: NodeWithList,
      },
      {
        id: 'EK',
        label: `EK`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopEkFolder',
        treeId: `${tpopId}EkFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'EK',
        ],
        hasChildren: false,
        component: Node,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopDateienFolder',
        treeId: `${tpopId}DateienFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Dateien',
        ],
        hasChildren: false,
        component: Node,
      },
      {
        id: 'Historien',
        label: `Historien (${historiesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopHistorienFolder',
        treeId: `${tpopId}HistorienFolder`,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Historien',
        ],
        hasChildren: false,
        component: Node,
      },
    ],
  }

  return { isLoading, error, navData }
}
