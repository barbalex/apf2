import { useMemo, useContext, useEffect, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { TpopMapIcon } from '../components/NavElements/TpopMapIcon.jsx'
import { popIcons } from './usePopsNavData.js'
import { PopIconQHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/QHighlighted.jsx'
import { PopIconQ } from '../components/Projekte/Karte/layers/Pop/statusGroup/Q.jsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.jsx'
import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'
import { useProjekteTabs } from './useProjekteTabs.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.jsx'

export const usePopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const store = useContext(MobxContext)

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')
  const showTpopIcon =
    store.activeApfloraLayers?.includes('tpop') && karteIsVisible

  const [, setRerenderer] = useState(0)
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treePop',
      popId,
      store.tree.tpopGqlFilterForTree,
      store.tree.popberGqlFilterForTree,
      store.tree.popmassnberGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
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
          tpopFilter: store.tree.tpopGqlFilterForTree,
          popberFilter: store.tree.popberGqlFilterForTree,
          popmassnberFilter: store.tree.popmassnberGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.tpopGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.popberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.popmassnberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.map.popIcon, rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => reaction(() => store.tree.showPopIcon, rerender),
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

  const label = data?.data?.popById?.label
  const status = data?.data?.popById?.status
  const tpopsCount = data?.data?.popById?.tpopsByPopId?.totalCount ?? 0
  const filteredTpopsCount = data?.data?.popById?.filteredTpops?.totalCount ?? 0
  const popbersCount = data?.data?.popById?.popbersByPopId?.totalCount ?? 0
  const filteredPopbersCount =
    data?.data?.popById?.filteredPopbers?.totalCount ?? 0
  const popmassnbersCount =
    data?.data?.popById?.popmassnbersByPopId?.totalCount ?? 0
  const filteredPopmassnbersCount =
    data?.data?.popById?.filteredPopmassnbers?.totalCount ?? 0
  const filesCount = data?.data?.popById?.popFilesByPopId?.totalCount ?? 0
  const historiesCount = data?.data?.allPopHistories?.totalCount ?? 0

  const popIconName = store.map.popIcon

  const popIconIsHighlighted = props?.popId === params.popId
  const PopIcon = status
    ? popIconIsHighlighted
      ? popIcons[popIconName][status + 'Highlighted']
      : popIcons[popIconName][status]
    : popIconIsHighlighted
      ? PopIconQHighlighted
      : PopIconQ

  const labelRightElements = useMemo(() => {
    const labelRightElements = []
    const isMoving = store.moving.id === popId
    if (isMoving) {
      labelRightElements.push(MovingIcon)
    }
    const isCopying = store.copying.id === popId
    if (isCopying) {
      labelRightElements.push(CopyingIcon)
    }

    return labelRightElements
  }, [store.moving.id, store.copying.id, popId])

  const navData = useMemo(
    () => ({
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
      labelLeftElements: store.tree.showPopIcon ? [PopIcon] : undefined,
      labelRightElements: labelRightElements.length
        ? labelRightElements
        : undefined,
      component: NodeWithList,
      menus: [
        {
          id: 'Population',
          label: `Population`,
          labelLeftElements: store.tree.showPopIcon ? [PopIcon] : undefined,
          labelRightElements: labelRightElements.length
            ? labelRightElements
            : undefined,
          isSelf: true,
        },
        {
          id: 'Teil-Populationen',
          label: `Teil-Populationen (${isLoading ? '...' : `${filteredTpopsCount}/${tpopsCount}`})`,
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
          labelLeftElements: showTpopIcon ? [TpopMapIcon] : undefined,
          component: NodeWithList,
        },
        {
          id: 'Kontroll-Berichte',
          label: `Kontroll-Berichte (${isLoading ? '...' : `${filteredPopbersCount}/${popbersCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: `popberFolder`,
          treeId: `${popId}PopberFolder`,
          treeTableId: popId,
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
          label: `Massnahmen-Berichte (${isLoading ? '...' : `${filteredPopmassnbersCount}/${popmassnbersCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: `popmassnberFolder`,
          treeId: `${popId}PopmassnberFolder`,
          treeTableId: popId,
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
          treeTableId: popId,
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
          treeTableId: popId,
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
          treeTableId: popId,
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
    }),
    [
      popId,
      projId,
      apId,
      label,
      status,
      store.tree.showPopIcon,
      PopIcon,
      labelRightElements,
      isLoading,
      filteredTpopsCount,
      tpopsCount,
      showTpopIcon,
      filteredPopbersCount,
      popbersCount,
      filteredPopmassnbersCount,
      popmassnbersCount,
      filesCount,
      historiesCount,
    ],
  )

  return { isLoading, error, navData }
}
