import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import {
  mapActiveApfloraLayersAtom,
  copyingAtom,
  movingAtom,
  store,
  mapTpopIconAtom,
  treeShowTpopIconAtom,
  treeTpopGqlFilterForTreeAtom,
} from '../store/index.ts'

import { TpopIcon100 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/100.tsx'
import { TpopIcon100Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/100Highlighted.tsx'
import { TpopIcon101 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/101.tsx'
import { TpopIcon101Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/101Highlighted.tsx'
import { TpopIcon200 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/200.tsx'
import { TpopIcon200Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/200Highlighted.tsx'
import { TpopIcon201 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/201.tsx'
import { TpopIcon201Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/201Highlighted.tsx'
import { TpopIcon202 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/202.tsx'
import { TpopIcon202Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/202Highlighted.tsx'
import { TpopIcon300 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/300.tsx'
import { TpopIcon300Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/300Highlighted.tsx'
import { TpopIcon } from '../components/Projekte/Karte/layers/Tpop/tpop.tsx'
import { TpopIconHighlighted } from '../components/Projekte/Karte/layers/Tpop/tpopHighlighted.tsx'
import { TpopIconU } from '../components/Projekte/Karte/layers/Tpop/statusGroup/u.tsx'
import { TpopIconUHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/uHighlighted.tsx'
import { TpopIconA } from '../components/Projekte/Karte/layers/Tpop/statusGroup/a.tsx'
import { TpopIconAHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/aHighlighted.tsx'
import { TpopIconP } from '../components/Projekte/Karte/layers/Tpop/statusGroup/p.tsx'
import { TpopIconPHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/pHighlighted.tsx'
import { TpopIconQ } from '../components/Projekte/Karte/layers/Tpop/statusGroup/q.tsx'
import { TpopIconQHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/qHighlighted.tsx'

import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'
import { TpopMapIcon } from '../components/NavElements/TpopMapIcon.tsx'
import { useProjekteTabs } from './useProjekteTabs.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const tpopIcons = {
  normal: {
    100: TpopIcon,
    '100Highlighted': TpopIconHighlighted,
    101: TpopIcon,
    '101Highlighted': TpopIconHighlighted,
    200: TpopIcon,
    '200Highlighted': TpopIconHighlighted,
    201: TpopIcon,
    '201Highlighted': TpopIconHighlighted,
    202: TpopIcon,
    '202Highlighted': TpopIconHighlighted,
    300: TpopIcon,
    '300Highlighted': TpopIconHighlighted,
  },
  statusGroup: {
    100: TpopIconU,
    '100Highlighted': TpopIconUHighlighted,
    101: TpopIconU,
    '101Highlighted': TpopIconUHighlighted,
    200: TpopIconA,
    '200Highlighted': TpopIconAHighlighted,
    201: TpopIconA,
    '201Highlighted': TpopIconAHighlighted,
    202: TpopIconA,
    '202Highlighted': TpopIconAHighlighted,
    300: TpopIconP,
    '300Highlighted': TpopIconPHighlighted,
  },
  statusGroupSymbols: {
    100: TpopIcon100,
    '100Highlighted': TpopIcon100Highlighted,
    101: TpopIcon101,
    '101Highlighted': TpopIcon101Highlighted,
    200: TpopIcon200,
    '200Highlighted': TpopIcon200Highlighted,
    201: TpopIcon201,
    '201Highlighted': TpopIcon201Highlighted,
    202: TpopIcon202,
    '202Highlighted': TpopIcon202Highlighted,
    300: TpopIcon300,
    '300Highlighted': TpopIcon300Highlighted,
  },
}

export const useTpopsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const moving = useAtomValue(movingAtom)
  const tpopGqlFilterForTree = useAtomValue(treeTpopGqlFilterForTreeAtom)

  const [projekteTabs] = useProjekteTabs()
  const karteIsVisible = projekteTabs.includes('karte')

  const activeApfloraLayers = useAtomValue(mapActiveApfloraLayersAtom)
  const showTpopIcon = activeApfloraLayers?.includes('tpop') && karteIsVisible

  const { data } = useQuery({
    queryKey: ['treeTpop', popId, tpopGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeTpopsQuery($tpopsFilter: TpopFilter!, $popId: UUID!) {
            popById(id: $popId) {
              id
              tpopsByPopId(
                filter: $tpopsFilter
                orderBy: [NR_ASC, FLURNAME_ASC]
              ) {
                nodes {
                  id
                  label
                  status
                }
              }
              totalCount: tpopsByPopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopsFilter: tpopGqlFilterForTree,
          popId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)

  useEffect(
    () => {
      const unsub = store.sub(mapTpopIconAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = store.sub(treeShowTpopIconAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = store.sub(movingAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const copying = useAtomValue(copyingAtom)
  useEffect(
    () => {
      const unsub = store.sub(copyingAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.popById?.tpopsByPopId?.nodes?.length ?? 0
  const totalCount = data?.data?.popById?.totalCount?.totalCount ?? 0

  const tpopIconName = store.get(mapTpopIconAtom)

  const navData = {
    id: 'Teil-Populationen',
    listFilter: 'tpop',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen`,
    label: `Teil-Populationen (${count}/${totalCount})`,
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
    hasChildren: !!count,
    labelLeftElements: showTpopIcon ? [TpopMapIcon] : undefined,
    component: NodeWithList,
    menus: (data?.data?.popById?.tpopsByPopId?.nodes ?? []).map((p) => {
      const labelRightElements = []
      const isMoving = moving.id === p.id
      if (isMoving) {
        labelRightElements.push(MovingIcon)
      }
      const isCopying = copying.id === p.id
      if (isCopying) {
        labelRightElements.push(CopyingIcon)
      }

      const iconIsHighlighted = p.id === tpopId
      const TpopIcon = p.status
        ? iconIsHighlighted
          ? tpopIcons[tpopIconName][p.status + 'Highlighted']
          : tpopIcons[tpopIconName][p.status]
        : iconIsHighlighted
          ? TpopIconQHighlighted
          : TpopIconQ

      return {
        id: p.id,
        label: p.label,
        status: p.status,
        treeNodeType: 'table',
        treeMenuType: 'tpop',
        treeId: p.id,
        treeParentTableId: popId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          p.id,
        ],
        fetcherName: 'useTpopNavData',
        fetcherParams: { projId, apId, popId, tpopId: p.id },
        hasChildren: true,
        labelLeftElements: showTpopIcon ? [TpopIcon] : undefined,
        labelRightElements: labelRightElements.length
          ? labelRightElements
          : undefined,
      }
    }),
  }

  return navData
}
