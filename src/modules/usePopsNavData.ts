import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { PopIcon100 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/100.tsx'
import { PopIcon100Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/100Highlighted.tsx'
import { PopIcon101 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/101.tsx'
import { PopIcon101Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/101Highlighted.tsx'
import { PopIcon200 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/200.tsx'
import { PopIcon200Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/200Highlighted.tsx'
import { PopIcon201 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/201.tsx'
import { PopIcon201Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/201Highlighted.tsx'
import { PopIcon202 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/202.tsx'
import { PopIcon202Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/202Highlighted.tsx'
import { PopIcon300 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/300.tsx'
import { PopIcon300Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/300Highlighted.tsx'
import { PopIcon as PopIconComponent } from '../components/Projekte/Karte/layers/Pop/Pop.tsx'
import { PopIconHighlighted } from '../components/Projekte/Karte/layers/Pop/PopHighlighted.tsx'
import { PopIconU } from '../components/Projekte/Karte/layers/Pop/statusGroup/U.tsx'
import { PopIconUHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/UHighlighted.tsx'
import { PopIconA } from '../components/Projekte/Karte/layers/Pop/statusGroup/A.tsx'
import { PopIconAHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/AHighlighted.tsx'
import { PopIconP } from '../components/Projekte/Karte/layers/Pop/statusGroup/P.tsx'
import { PopIconPHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/PHighlighted.tsx'
import { PopIconQ } from '../components/Projekte/Karte/layers/Pop/statusGroup/Q.tsx'
import { PopIconQHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/QHighlighted.tsx'

import {
  copyingAtom,
  movingAtom,
  store as jotaiStore,
  mapPopIconAtom,
  treeShowPopIconAtom,
  treePopGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'
import { PopMapIcon } from '../components/NavElements/PopMapIcon.tsx'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const popIcons = {
  normal: {
    100: PopIconComponent,
    '100Highlighted': PopIconHighlighted,
    101: PopIconComponent,
    '101Highlighted': PopIconHighlighted,
    200: PopIconComponent,
    '200Highlighted': PopIconHighlighted,
    201: PopIconComponent,
    '201Highlighted': PopIconHighlighted,
    202: PopIconComponent,
    '202Highlighted': PopIconHighlighted,
    300: PopIconComponent,
    '300Highlighted': PopIconHighlighted,
  },
  statusGroup: {
    100: PopIconU,
    '100Highlighted': PopIconUHighlighted,
    101: PopIconU,
    '101Highlighted': PopIconUHighlighted,
    200: PopIconA,
    '200Highlighted': PopIconAHighlighted,
    201: PopIconA,
    '201Highlighted': PopIconAHighlighted,
    202: PopIconA,
    '202Highlighted': PopIconAHighlighted,
    300: PopIconP,
    '300Highlighted': PopIconPHighlighted,
  },
  statusGroupSymbols: {
    100: PopIcon100,
    '100Highlighted': PopIcon100Highlighted,
    101: PopIcon101,
    '101Highlighted': PopIcon101Highlighted,
    200: PopIcon200,
    '200Highlighted': PopIcon200Highlighted,
    201: PopIcon201,
    '201Highlighted': PopIcon201Highlighted,
    202: PopIcon202,
    '202Highlighted': PopIcon202Highlighted,
    300: PopIcon300,
    '300Highlighted': PopIcon300Highlighted,
  },
}

export const usePopsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const copying = useAtomValue(copyingAtom)
  const moving = useAtomValue(movingAtom)
  const popGqlFilterForTree = useAtomValue(treePopGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treePop', apId, popGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreePopsQuery($popsFilter: PopFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              popsByApId(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC]) {
                nodes {
                  id
                  label
                  status
                }
              }
              totalCount: popsByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          popsFilter: popGqlFilterForTree,
          apId,
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
      const unsub = jotaiStore.sub(mapPopIconAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = jotaiStore.sub(treeShowPopIconAtom, rerender)
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
  useEffect(
    () => {
      const unsub = jotaiStore.sub(treePopGqlFilterForTreeAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.apById?.popsByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const popIconName = jotaiStore.get(mapPopIconAtom)
  const showPopIcon = jotaiStore.get(treeShowPopIconAtom)

  const navData = {
    id: 'Populationen',
    listFilter: 'pop',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen`,
    label: `Populationen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'popFolder',
    treeId: `${apId}PopFolder`,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'Populationen'],
    fetcherName: 'usePopsNavData',
    fetcherParams: { projId, apId },
    hasChildren: !!count,
    labelLeftElements: showPopIcon ? [PopMapIcon] : undefined,
    component: NodeWithList,
    menus: (data?.data?.apById?.popsByApId?.nodes ?? []).map((p) => {
      const labelRightElements = []
      const isMoving = moving.id === p.id
      if (isMoving) {
        labelRightElements.push(MovingIcon)
      }
      const isCopying = copying.id === p.id
      if (isCopying) {
        labelRightElements.push(CopyingIcon)
      }

      const popIconIsHighlighted = p.id === popId
      const PopIcon =
        p.status ?
          popIconIsHighlighted ? popIcons[popIconName][p.status + 'Highlighted']
          : popIcons[popIconName][p.status]
        : popIconIsHighlighted ? PopIconQHighlighted
        : PopIconQ

      return {
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'pop',
        treeSingleElementName: 'Population',
        treeId: p.id,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Populationen', p.id],
        hasChildren: true,
        fetcherName: 'usePopNavData',
        fetcherParams: { projId, apId, popId: p.id },
        status: p.status,
        labelLeftElements: showPopIcon ? [PopIcon] : undefined,
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      }
    }),
  }

  return navData
}
