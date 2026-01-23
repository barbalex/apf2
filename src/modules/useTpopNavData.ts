import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  copyingAtom,
  movingAtom,
  store as jotaiStore,
  mapActiveApfloraLayersAtom,
  mapTpopIconAtom,
  treeShowTpopIconAtom,
  treeTpopmassnGqlFilterForTreeAtom,
  treeTpopmassnberGqlFilterForTreeAtom,
  treeTpopberGqlFilterForTreeAtom,
  treeEkGqlFilterForTreeAtom,
  treeEkfGqlFilterForTreeAtom,
  treeBeobZugeordnetGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { BeobzugeordnetMapIcon } from '../components/NavElements/BeobzugeordnetMapIcon.tsx'
import { useProjekteTabs } from './useProjekteTabs.ts'

import { TpopIconQHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/qHighlighted.tsx'
import { TpopIconQ } from '../components/Projekte/Karte/layers/Tpop/statusGroup/q.tsx'
import { tpopIcons } from './useTpopsNavData.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'
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

  const copying = useAtomValue(copyingAtom)
  const moving = useAtomValue(movingAtom)
  const tpopmassnGqlFilterForTree = useAtomValue(
    treeTpopmassnGqlFilterForTreeAtom,
  )
  const tpopmassnberGqlFilterForTree = useAtomValue(
    treeTpopmassnberGqlFilterForTreeAtom,
  )
  const tpopberGqlFilterForTree = useAtomValue(treeTpopberGqlFilterForTreeAtom)
  const ekGqlFilterForTree = useAtomValue(treeEkGqlFilterForTreeAtom)
  const ekfGqlFilterForTree = useAtomValue(treeEkfGqlFilterForTreeAtom)
  const beobZugeordnetGqlFilterForTree = useAtomValue(
    treeBeobZugeordnetGqlFilterForTreeAtom,
  )

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const showBeobzugeordnetIcon =
    activeApfloraLayers?.includes('beobZugeordnet') && karteIsVisible
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)

  const { data, refetch } = useQuery({
    queryKey: [
      'treeTpop',
      tpopId,
      tpopmassnGqlFilterForTree,
      tpopmassnberGqlFilterForTree,
      ekGqlFilterForTree,
      ekfGqlFilterForTree,
      tpopberGqlFilterForTree,
      beobZugeordnetGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
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
          tpopmassnFilter: tpopmassnGqlFilterForTree,
          tpopmassnberFilter: tpopmassnberGqlFilterForTree,
          tpopfeldkontrFilter: ekGqlFilterForTree,
          tpopfreiwkontrFilter: ekfGqlFilterForTree,
          tpopberFilter: tpopberGqlFilterForTree,
          beobZugeordnetFilter: {
            ...beobZugeordnetGqlFilterForTree,
            tpopId: { equalTo: tpopId },
          },
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  useEffect(
    () => {
      const unsub = jotaiStore.sub(treeTpopmassnGqlFilterForTreeAtom, refetch)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = jotaiStore.sub(
        treeTpopmassnberGqlFilterForTreeAtom,
        refetch,
      )
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = jotaiStore.sub(treeEkGqlFilterForTreeAtom, refetch)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = jotaiStore.sub(treeEkfGqlFilterForTreeAtom, refetch)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(() => {
    const unsub = jotaiStore.sub(treeTpopberGqlFilterForTreeAtom, refetch)
    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    const unsub = jotaiStore.sub(
      treeBeobZugeordnetGqlFilterForTreeAtom,
      refetch,
    )
    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(
    () => {
      const unsub = jotaiStore.sub(mapActiveApfloraLayersAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = jotaiStore.sub(mapTpopIconAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = jotaiStore.sub(treeShowTpopIconAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = jotaiStore.sub(movingAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = jotaiStore.sub(copyingAtom, rerender)
      return unsub
    },
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

  const tpopIconName = jotaiStore.get(mapTpopIconAtom)

  const tpopIconIsHighlighted = props?.tpopId === params.tpopId
  const TpopIcon =
    status ?
      tpopIconIsHighlighted ? tpopIcons[tpopIconName][status + 'Highlighted']
      : tpopIcons[tpopIconName][status]
    : tpopIconIsHighlighted ? TpopIconQHighlighted
    : TpopIconQ

  const showTpopIcon = jotaiStore.get(treeShowTpopIconAtom)

  const labelRightElements = getLabelRightElements({
    movingId: moving.id,
    copyingId: copying.id,
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
    labelLeftElements: showTpopIcon ? [TpopIcon] : undefined,
    labelRightElements:
      labelRightElements.length ? labelRightElements : undefined,
    component: NodeWithList,
    menus: [
      {
        id: 'Teil-Population',
        label: `Teil-Population`,
        isSelf: true,
        labelLeftElements: showTpopIcon ? [TpopIcon] : undefined,
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      },
      {
        id: 'Massnahmen',
        label: `Massnahmen (${filteredMassnCount}/${massnCount})`,
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
        label: `Massnahmen-Berichte (${filteredTpopmassnbersCount}/${popmassnbersCount})`,
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
        label: `Feld-Kontrollen (${filteredFeldkontrCount}/${feldkontrCount})`,
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
        label: `Freiwilligen-Kontrollen (${filteredFreiwkontrCount}/${freiwkontrCount})`,
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
        label: `Kontroll-Berichte (${filteredTpopbersCount}/${tpopbersCount})`,
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
        label: `Beobachtungen zugeordnet (${filteredBeobZugeordnetCount}/${beobZugeordnetCount})`,
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

  return navData
}
