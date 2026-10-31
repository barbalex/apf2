import { useEffect, useState } from 'react'
import { apiCount, apiFetch, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  copyingAtom,
  movingAtom,
  store,
  mapActiveApfloraLayersAtom,
  mapTpopIconAtom,
  treeShowTpopIconAtom,
  treeTpopmassnGqlFilterForTreeAtom,
  treeEkGqlFilterForTreeAtom,
  treeEkfGqlFilterForTreeAtom,
  treeBeobZugeordnetGqlFilterForTreeAtom,
} from '../store/index.ts'
import { getTpopmassnberGqlFilterForTree } from './getTpopmassnberGqlFilterForTree.ts'
import { getTpopberGqlFilterForTree } from './getTpopberGqlFilterForTree.ts'
import { BeobzugeordnetMapIcon } from '../components/NavElements/BeobzugeordnetMapIcon.tsx'
import { useProjekteTabs } from './useProjekteTabs.ts'

import { TpopIconQHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/qHighlighted.tsx'
import { TpopIconQ } from '../components/Projekte/Karte/layers/Tpop/statusGroup/q.tsx'
import { tpopIcons } from './useTpopsNavData.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'

const getLabelRightElements = ({
  movingId,
  copyingId,
  tpopId,
}: {
  movingId: string | null
  copyingId: string | null
  tpopId: string
}) => {
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

export const useTpopNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
        tpopId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''
  const tpopId = props?.tpopId ?? params.tpopId ?? ''

  const copying = useAtomValue(copyingAtom)
  const moving = useAtomValue(movingAtom)
  const tpopmassnGqlFilterForTree = useAtomValue(
    treeTpopmassnGqlFilterForTreeAtom,
  )
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

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeTpop',
      tpopId,
      tpopmassnGqlFilterForTree,
      ekGqlFilterForTree,
      ekfGqlFilterForTree,
      beobZugeordnetGqlFilterForTree,
    ],
    queryFn: async () => {
      const tpopmassnberGqlFilterForTree =
        getTpopmassnberGqlFilterForTree(tpopId)
      const tpopberGqlFilterForTree = getTpopberGqlFilterForTree(tpopId)
      // phase 5: the former XByTpopId relation constraints merge into the
      // cascade filters; sibling keys are ANDed by compile_filter
      const tpopOf = (filter: object) => ({
        ...filter,
        tpopByTpopId: {
          ...((filter as { tpopByTpopId?: object }).tpopByTpopId ?? {}),
          id: { equalTo: tpopId },
        },
      })
      const beobZugeordnetFilter = {
        ...beobZugeordnetGqlFilterForTree,
        tpopId: { equalTo: tpopId },
      }
      const [
        tpop,
        massnFiltered,
        massnAll,
        massnberFiltered,
        massnberAll,
        feldkontrFiltered,
        feldkontrAll,
        freiwkontrFiltered,
        freiwkontrAll,
        tpopberFiltered,
        tpopberAll,
        beobZugeordnetFiltered,
        beobZugeordnetAll,
        filesCount,
        historiesCount,
      ] = await Promise.all([
        apiFetch<{ id: string; label: string | null; status: number | null }[]>(
          `/q_tpop?id=eq.${tpopId}&select=id,label,status`,
        ),
        rpcCount('query_tpopmassn', {
          p_filter: tpopOf(tpopmassnGqlFilterForTree),
        }),
        apiCount(`/q_tpopmassn?tpop_id=eq.${tpopId}`),
        rpcCount('query_tpopmassnber', {
          p_filter: tpopOf(tpopmassnberGqlFilterForTree),
        }),
        apiCount(`/q_tpopmassnber?tpop_id=eq.${tpopId}`),
        rpcCount('query_tpopkontr', { p_filter: tpopOf(ekGqlFilterForTree) }),
        rpcCount('query_tpopkontr', {
          p_filter: {
            typ: { distinctFrom: 'Freiwilligen-Kontrolle' },
            tpopByTpopId: { id: { equalTo: tpopId } },
          },
        }),
        rpcCount('query_tpopkontr', {
          p_filter: tpopOf(ekfGqlFilterForTree),
        }),
        rpcCount('query_tpopkontr', {
          p_filter: {
            typ: { equalTo: 'Freiwilligen-Kontrolle' },
            tpopByTpopId: { id: { equalTo: tpopId } },
          },
        }),
        rpcCount('query_tpopber', {
          p_filter: tpopOf(tpopberGqlFilterForTree),
        }),
        apiCount(`/q_tpopber?tpop_id=eq.${tpopId}`),
        rpcCount('query_beob', { p_filter: beobZugeordnetFilter }),
        apiCount(`/q_beob?tpop_id=eq.${tpopId}`),
        apiCount(`/tpop_file?tpop_id=eq.${tpopId}`),
        apiCount(`/v_tpop_history?id=eq.${tpopId}`),
      ])
      return {
        tpopById: {
          id: tpopId,
          label: tpop?.[0]?.label,
          status: tpop?.[0]?.status,
          tpopmassnsByTpopId: { totalCount: massnAll },
          filteredTpopmassns: { totalCount: massnFiltered },
          tpopmassnbersByTpopId: { totalCount: massnberAll },
          filteredTpopmassnbers: { totalCount: massnberFiltered },
          tpopfeldkontrs: { totalCount: feldkontrAll },
          filteredTpopfeldkontrs: { totalCount: feldkontrFiltered },
          tpopfreiwkontrs: { totalCount: freiwkontrAll },
          filteredTpopfreiwkontrs: { totalCount: freiwkontrFiltered },
          tpopbersByTpopId: { totalCount: tpopberAll },
          filteredTpopbers: { totalCount: tpopberFiltered },
          beobZugeordnet: { totalCount: beobZugeordnetAll },
          filteredBeobZugeordnet: { totalCount: beobZugeordnetFiltered },
          tpopFilesByTpopId: { totalCount: filesCount },
        },
        allTpopHistories: { totalCount: historiesCount },
      }
    },
  })
  useEffect(() => {
    const unsub = store.sub(mapActiveApfloraLayersAtom, rerender)
    return unsub
  }, [])
  useEffect(() => {
    const unsub = store.sub(mapTpopIconAtom, rerender)
    return unsub
  }, [])
  useEffect(() => {
    const unsub = store.sub(treeShowTpopIconAtom, rerender)
    return unsub
  }, [])
  useEffect(() => {
    const unsub = store.sub(movingAtom, rerender)
    return unsub
  }, [])
  useEffect(() => {
    const unsub = store.sub(copyingAtom, rerender)
    return unsub
  }, [])

  const label = data.tpopById?.label
  const status = data.tpopById?.status
  const massnCount = data.tpopById?.tpopmassnsByTpopId?.totalCount ?? 0
  const filteredMassnCount = data.tpopById?.filteredTpopmassns?.totalCount ?? 0
  const popmassnbersCount =
    data.tpopById?.tpopmassnbersByTpopId?.totalCount ?? 0
  const filteredTpopmassnbersCount =
    data.tpopById?.filteredTpopmassnbers?.totalCount ?? 0
  const feldkontrCount = data.tpopById?.tpopfeldkontrs?.totalCount ?? 0
  const filteredFeldkontrCount =
    data.tpopById?.filteredTpopfeldkontrs?.totalCount ?? 0
  const freiwkontrCount = data.tpopById?.tpopfreiwkontrs?.totalCount ?? 0
  const filteredFreiwkontrCount =
    data.tpopById?.filteredTpopfreiwkontrs?.totalCount ?? 0
  const tpopbersCount = data.tpopById?.tpopbersByTpopId?.totalCount ?? 0
  const filteredTpopbersCount = data.tpopById?.filteredTpopbers?.totalCount ?? 0
  const beobZugeordnetCount = data.tpopById?.beobZugeordnet?.totalCount ?? 0
  const filteredBeobZugeordnetCount =
    data.tpopById?.filteredBeobZugeordnet?.totalCount ?? 0
  const filesCount = data.tpopById?.tpopFilesByTpopId?.totalCount ?? 0
  const historiesCount = data.allTpopHistories?.totalCount ?? 0

  const tpopIconName = store.get(mapTpopIconAtom)

  const tpopIconIsHighlighted = props?.tpopId === params.tpopId
  const TpopIcon =
    status ?
      tpopIconIsHighlighted ?
        (tpopIcons as Record<string, Record<string, React.ComponentType>>)[
          tpopIconName as string
        ]?.[status + 'Highlighted']
      : (tpopIcons as Record<string, Record<string, React.ComponentType>>)[
          tpopIconName as string
        ]?.[status]
    : tpopIconIsHighlighted ? TpopIconQHighlighted
    : TpopIconQ

  const showTpopIcon = store.get(treeShowTpopIconAtom)

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
    treeTableId: tpopId,
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
    menus: [
      {
        id: 'Teil-Population',
        treeTableId: tpopId,
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
        treeTableId: tpopId,
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
      },
      {
        id: 'Massnahmen-Berichte',
        label: `Massnahmen-Berichte (${filteredTpopmassnbersCount}/${popmassnbersCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopmassnberFolder',
        treeId: `${tpopId}MassnberFolder`,
        treeTableId: tpopId,
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
      },
      {
        id: 'Feld-Kontrollen',
        label: `Feld-Kontrollen (${filteredFeldkontrCount}/${feldkontrCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopfeldkontrFolder',
        treeId: `${tpopId}FeldkontrFolder`,
        treeTableId: tpopId,
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
        treeTableId: tpopId,
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
        treeTableId: tpopId,
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
      },
      {
        id: 'Beobachtungen',
        label: `Beobachtungen zugeordnet (${filteredBeobZugeordnetCount}/${beobZugeordnetCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'beobZugeordnetFolder',
        treeId: `${tpopId}BeobZugeordnetFolder`,
        treeTableId: tpopId,
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
      },
      {
        id: 'EK',
        label: `EK`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopEkFolder',
        treeId: `${tpopId}EkFolder`,
        treeTableId: tpopId,
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
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopDateienFolder',
        treeId: `${tpopId}DateienFolder`,
        treeTableId: tpopId,
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
      },
      {
        id: 'Historien',
        label: `Historien (${historiesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopHistorienFolder',
        treeId: `${tpopId}HistorienFolder`,
        treeTableId: tpopId,
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
      },
    ],
  }

  return navData
}
