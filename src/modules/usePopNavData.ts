import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import {
  copyingAtom,
  movingAtom,
  store,
  mapPopIconAtom,
  treeShowPopIconAtom,
  treeTpopGqlFilterForTreeAtom,
  treePopberGqlFilterForTreeAtom,
  treePopmassnberGqlFilterForTreeAtom,
} from '../store/index.ts'
import { popIcons } from './usePopsNavData.ts'
import { PopIconQHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/QHighlighted.tsx'
import { PopIconQ } from '../components/Projekte/Karte/layers/Pop/statusGroup/Q.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { useProjekteTabs } from './useProjekteTabs.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.tsx'

const getLabelRightElements = ({ movingId, copyingId, popId }) => {
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

export const usePopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const copying = useAtomValue(copyingAtom)
  const tpopGqlFilterForTree = useAtomValue(treeTpopGqlFilterForTreeAtom)
  const popberGqlFilterForTree = useAtomValue(treePopberGqlFilterForTreeAtom)
  const popmassnberGqlFilterForTree = useAtomValue(
    treePopmassnberGqlFilterForTreeAtom,
  )

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const moving = useAtomValue(movingAtom)

  const { data } = useQuery({
    queryKey: [
      'treePop',
      popId,
      tpopGqlFilterForTree,
      popberGqlFilterForTree,
      popmassnberGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavPopQuery(
            $popId: UUID!
            $tpopFilter: TpopFilter!
            $popberFilter: PopberFilter!
            $popmassnberFilter: PopmassnberFilter!
          ) {
            popById(id: $popId) {
              id
              label
              status
              tpopsByPopId {
                totalCount
              }
              filteredTpops: tpopsByPopId(filter: $tpopFilter) {
                totalCount
              }
              popbersByPopId {
                totalCount
              }
              filteredPopbers: popbersByPopId(filter: $popberFilter) {
                totalCount
              }
              popmassnbersByPopId {
                totalCount
              }
              filteredPopmassnbers: popmassnbersByPopId(
                filter: $popmassnberFilter
              ) {
                totalCount
              }
              popFilesByPopId {
                totalCount
              }
            }
            allPopHistories(filter: { id: { equalTo: $popId } }) {
              totalCount
            }
          }
        `,
        variables: {
          popId,
          tpopFilter: tpopGqlFilterForTree,
          popberFilter: popberGqlFilterForTree,
          popmassnberFilter: popmassnberGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const label = data.popById?.label
  const status = data.popById?.status
  const tpopsCount = data.popById?.tpopsByPopId?.totalCount ?? 0
  const filteredTpopsCount = data.popById?.filteredTpops?.totalCount ?? 0
  const popbersCount = data.popById?.popbersByPopId?.totalCount ?? 0
  const filteredPopbersCount =
    data.popById?.filteredPopbers?.totalCount ?? 0
  const popmassnbersCount =
    data.popById?.popmassnbersByPopId?.totalCount ?? 0
  const filteredPopmassnbersCount =
    data.popById?.filteredPopmassnbers?.totalCount ?? 0
  const filesCount = data.popById?.popFilesByPopId?.totalCount ?? 0
  const historiesCount = data.allPopHistories?.totalCount ?? 0

  const popIconName = store.get(mapPopIconAtom)

  const popIconIsHighlighted = props?.popId === params.popId
  const PopIcon =
    status ?
      popIconIsHighlighted ? popIcons[popIconName][status + 'Highlighted']
      : popIcons[popIconName][status]
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
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'Populationen', popId],
    hasChildren: true,
    fetcherName: 'usePopNavData',
    fetcherParams: { projId, apId, popId },
    status,
    labelLeftElements: showPopIcon ? [PopIcon] : undefined,
    labelRightElements:
      labelRightElements.length ? labelRightElements : undefined,
    component: NodeWithList,
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
        component: NodeWithList,
      },
      {
        id: 'Kontroll-Berichte',
        label: `Kontroll-Berichte (${filteredPopbersCount}/${popbersCount})`,
        treeNodeType: 'folder',
        treeMenuType: `popberFolder`,
        treeId: `${popId}PopberFolder`,
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
        component: NodeWithList,
      },
      {
        id: 'Massnahmen-Berichte',
        label: `Massnahmen-Berichte (${filteredPopmassnbersCount}/${popmassnbersCount})`,
        treeNodeType: 'folder',
        treeMenuType: `popmassnberFolder`,
        treeId: `${popId}PopmassnberFolder`,
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
        component: NodeWithList,
      },
      {
        id: 'Auswertung',
        label: `Auswertung`,
        treeNodeType: 'folder',
        treeMenuType: `popAuswertungFolder`,
        treeId: `${popId}AuswertungFolder`,
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
        component: Node,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: `popDateienFolder`,
        treeId: `${popId}DateienFolder`,
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
        component: Node,
      },
      {
        id: 'Historien',
        label: `Historien (${historiesCount})`,
        treeNodeType: 'folder',
        treeMenuType: `popHistorienFolder`,
        treeId: `${popId}HistorienFolder`,
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
        component: Node,
      },
    ],
  }

  return navData
}
