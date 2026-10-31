import { apiCount, apiFetch, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import {
  copyingAtom,
  movingAtom,
  store,
  mapPopIconAtom,
  treeShowPopIconAtom,
  treeTpopGqlFilterForTreeAtom,
} from '../store/index.ts'
import { getPopberGqlFilterForTree } from './getPopberGqlFilterForTree.ts'
import { getPopmassnberGqlFilterForTree } from './getPopmassnberGqlFilterForTree.ts'
import { popIcons } from './usePopsNavData.ts'
import { PopIconQHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/QHighlighted.tsx'
import { PopIconQ } from '../components/Projekte/Karte/layers/Pop/statusGroup/Q.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'

const getLabelRightElements = ({
  movingId,
  copyingId,
  popId,
}: {
  movingId: string | null
  copyingId: string | null
  popId: string
}) => {
  const labelRightElements = []
  const isMoving = movingId === popId
  if (isMoving) {
    labelRightElements.push(MovingIcon)
  }
  const isCopying = copyingId === popId
  if (isCopying) {
    labelRightElements.push(CopyingIcon)
  }

  return labelRightElements
}

export const usePopNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''

  const copying = useAtomValue(copyingAtom)
  const tpopGqlFilterForTree = useAtomValue(treeTpopGqlFilterForTreeAtom)

  const moving = useAtomValue(movingAtom)

  // Get filters before useQuery so changes trigger refetch
  const popberGqlFilterForTree = getPopberGqlFilterForTree(popId)
  const popmassnberGqlFilterForTree = getPopmassnberGqlFilterForTree(popId)

  const { data } = useSuspenseQuery({
    queryKey: [
      'treePop',
      popId,
      tpopGqlFilterForTree,
      popberGqlFilterForTree,
      popmassnberGqlFilterForTree,
    ],
    queryFn: async () => {
      // phase 5: the former XByPopId relation constraints merge into the
      // cascade filters; sibling keys are ANDed by compile_filter
      const popOf = (filter: object) => ({
        ...filter,
        popByPopId: {
          ...((filter as { popByPopId?: object }).popByPopId ?? {}),
          id: { equalTo: popId },
        },
      })
      const [
        pop,
        tpopsFiltered,
        tpopsAll,
        popbersFiltered,
        popbersAll,
        popmassnbersFiltered,
        popmassnbersAll,
        filesCount,
        historiesCount,
      ] = await Promise.all([
        apiFetch<{ id: string; label: string | null; status: number | null }[]>(
          `/q_pop?id=eq.${popId}&select=id,label,status`,
        ),
        rpcCount('query_tpop', { p_filter: popOf(tpopGqlFilterForTree) }),
        apiCount(`/q_tpop?pop_id=eq.${popId}`),
        rpcCount('query_popber', { p_filter: popOf(popberGqlFilterForTree) }),
        apiCount(`/q_popber?pop_id=eq.${popId}`),
        rpcCount('query_popmassnber', {
          p_filter: popOf(popmassnberGqlFilterForTree),
        }),
        apiCount(`/q_popmassnber?pop_id=eq.${popId}`),
        apiCount(`/pop_file?pop_id=eq.${popId}`),
        apiCount(`/v_pop_history?id=eq.${popId}`),
      ])
      return {
        popById: {
          id: popId,
          label: pop?.[0]?.label,
          status: pop?.[0]?.status,
          tpopsByPopId: { totalCount: tpopsAll },
          filteredTpops: { totalCount: tpopsFiltered },
          popbersByPopId: { totalCount: popbersAll },
          filteredPopbers: { totalCount: popbersFiltered },
          popmassnbersByPopId: { totalCount: popmassnbersAll },
          filteredPopmassnbers: { totalCount: popmassnbersFiltered },
          popFilesByPopId: { totalCount: filesCount },
        },
        allPopHistories: { totalCount: historiesCount },
      }
    },
  })

  const label = data.popById?.label
  const status = data.popById?.status
  const tpopsCount = data.popById?.tpopsByPopId?.totalCount ?? 0
  const filteredTpopsCount = data.popById?.filteredTpops?.totalCount ?? 0
  const popbersCount = data.popById?.popbersByPopId?.totalCount ?? 0
  const filteredPopbersCount = data.popById?.filteredPopbers?.totalCount ?? 0
  const popmassnbersCount = data.popById?.popmassnbersByPopId?.totalCount ?? 0
  const filteredPopmassnbersCount =
    data.popById?.filteredPopmassnbers?.totalCount ?? 0
  const filesCount = data.popById?.popFilesByPopId?.totalCount ?? 0
  const historiesCount = data.allPopHistories?.totalCount ?? 0

  const popIconName = store.get(mapPopIconAtom)

  const popIconIsHighlighted = props?.popId === params.popId
  const PopIcon =
    status ?
      popIconIsHighlighted ?
        (popIcons as Record<string, Record<string, React.ComponentType>>)[
          popIconName as string
        ]?.[status + 'Highlighted']
      : (popIcons as Record<string, Record<string, React.ComponentType>>)[
          popIconName as string
        ]?.[status]
    : popIconIsHighlighted ? PopIconQHighlighted
    : PopIconQ

  const labelRightElements = getLabelRightElements({
    movingId: moving.id,
    copyingId: copying.id,
    popId,
  })

  const showPopIcon = store.get(treeShowPopIconAtom)

  const navData = {
    id: popId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'pop',
    treeSingleElementName: 'Population',
    treeId: popId,
    treeTableId: popId,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'Populationen', popId],
    hasChildren: true,
    fetcherName: 'usePopNavData',
    fetcherParams: { projId, apId, popId },
    status,
    labelLeftElements: showPopIcon ? [PopIcon] : undefined,
    labelRightElements:
      labelRightElements.length ? labelRightElements : undefined,
    menus: [
      {
        id: 'Population',
        label: `Population`,
        labelLeftElements: showPopIcon ? [PopIcon] : undefined,
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
        isSelf: true,
      },
      {
        id: 'Teil-Populationen',
        label: `Teil-Populationen (${filteredTpopsCount}/${tpopsCount})`,
        treeNodeType: 'folder',
        treeMenuType: `tpopFolder`,
        treeId: `${popId}TpopFolder`,
        treeTableId: popId,
        treeParentTableId: popId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
        ],
        fetcherName: 'useTpopsNavData',
        fetcherParams: { projId, apId, popId },
        hasChildren: !!filteredTpopsCount,
      },
      {
        id: 'Kontroll-Berichte',
        label: `Kontroll-Berichte (${filteredPopbersCount}/${popbersCount})`,
        treeNodeType: 'folder',
        treeMenuType: `popberFolder`,
        treeId: `${popId}PopberFolder`,
        treeTableId: popId,
        treeParentTableId: popId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Kontroll-Berichte',
        ],
        fetcherName: 'usePopbersNavData',
        fetcherParams: { projId, apId, popId },
        hasChildren: !!filteredPopbersCount,
      },
      {
        id: 'Massnahmen-Berichte',
        label: `Massnahmen-Berichte (${filteredPopmassnbersCount}/${popmassnbersCount})`,
        treeNodeType: 'folder',
        treeMenuType: `popmassnberFolder`,
        treeId: `${popId}PopmassnberFolder`,
        treeTableId: popId,
        treeParentTableId: popId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Massnahmen-Berichte',
        ],
        fetcherName: 'usePopmassnbersNavData',
        fetcherParams: { projId, apId, popId },
        hasChildren: !!filteredPopmassnbersCount,
      },
      {
        id: 'Auswertung',
        label: `Auswertung`,
        treeNodeType: 'folder',
        treeMenuType: `popAuswertungFolder`,
        treeId: `${popId}AuswertungFolder`,
        treeTableId: popId,
        treeParentTableId: popId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Auswertung',
        ],
        hasChildren: false,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: `popDateienFolder`,
        treeId: `${popId}DateienFolder`,
        treeTableId: popId,
        treeParentTableId: popId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Dateien',
        ],
        hasChildren: false,
      },
      {
        id: 'Historien',
        label: `Historien (${historiesCount})`,
        treeNodeType: 'folder',
        treeMenuType: `popHistorienFolder`,
        treeId: `${popId}HistorienFolder`,
        treeTableId: popId,
        treeParentTableId: popId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Historien',
        ],
        hasChildren: false,
      },
    ],
  }

  return navData
}
