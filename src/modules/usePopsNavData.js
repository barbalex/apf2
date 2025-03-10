import { useMemo, useEffect, useContext, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { PopIcon100 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/100.jsx'
import { PopIcon100Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/100Highlighted.jsx'
import { PopIcon101 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/101.jsx'
import { PopIcon101Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/101Highlighted.jsx'
import { PopIcon200 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/200.jsx'
import { PopIcon200Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/200Highlighted.jsx'
import { PopIcon201 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/201.jsx'
import { PopIcon201Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/201Highlighted.jsx'
import { PopIcon202 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/202.jsx'
import { PopIcon202Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/202Highlighted.jsx'
import { PopIcon300 } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/300.jsx'
import { PopIcon300Highlighted } from '../components/Projekte/Karte/layers/Pop/statusGroupSymbols/300Highlighted.jsx'
import { PopIcon as PopIconComponent } from '../components/Projekte/Karte/layers/Pop/Pop.jsx'
import { PopIconHighlighted } from '../components/Projekte/Karte/layers/Pop/PopHighlighted.jsx'
import { PopIconU } from '../components/Projekte/Karte/layers/Pop/statusGroup/U.jsx'
import { PopIconUHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/UHighlighted.jsx'
import { PopIconA } from '../components/Projekte/Karte/layers/Pop/statusGroup/A.jsx'
import { PopIconAHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/AHighlighted.jsx'
import { PopIconP } from '../components/Projekte/Karte/layers/Pop/statusGroup/P.jsx'
import { PopIconPHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/PHighlighted.jsx'
import { PopIconQ } from '../components/Projekte/Karte/layers/Pop/statusGroup/Q.jsx'
import { PopIconQHighlighted } from '../components/Projekte/Karte/layers/Pop/statusGroup/QHighlighted.jsx'

import { MobxContext } from '../mobxContext.js'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.jsx'
import { PopMapIcon } from '../components/NavElements/PopMapIcon.jsx'
import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

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

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treePop', projId, apId, store.tree.popGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreePopsQuery($popsFilter: PopFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              popsByApId(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC]) {
                totalCount
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
          popsFilter: store.tree.popGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.popGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [, setRerenderer] = useState(0)
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])
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

  const count = data?.data?.apById?.popsByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const popIconName = store.map.popIcon

  const navData = useMemo(
    () => ({
      id: 'Populationen',
      listFilter: 'pop',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen`,
      label: `Populationen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      treeNodeType: 'folder',
      treeMenuType: 'popFolder',
      treeId: `${apId}PopFolder`,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'Populationen'],
      fetcherName: 'usePopsNavData',
      fetcherParams: { projId, apId },
      hasChildren: !!count,
      labelLeftElements: store.tree.showPopIcon ? [PopMapIcon] : undefined,
      component: NodeWithList,
      menus: (data?.data?.apById?.popsByApId?.nodes ?? []).map((p) => {
        const labelRightElements = []
        const isMoving = store.moving.id === p.id
        if (isMoving) {
          labelRightElements.push(MovingIcon)
        }
        const isCopying = store.copying.id === p.id
        if (isCopying) {
          labelRightElements.push(CopyingIcon)
        }

        const popIconIsHighlighted = p.id === popId
        const PopIcon = p.status
          ? popIconIsHighlighted
            ? popIcons[popIconName][p.status + 'Highlighted']
            : popIcons[popIconName][p.status]
          : popIconIsHighlighted
            ? PopIconQHighlighted
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
          labelLeftElements: store.tree.showPopIcon ? [PopIcon] : undefined,
          labelRightElements: labelRightElements.length
            ? labelRightElements
            : undefined,
        }
      }),
    }),
    [
      apId,
      count,
      data?.data?.apById?.popsByApId?.nodes,
      isLoading,
      popIconName,
      popId,
      projId,
      store.copying.id,
      store.moving.id,
      store.tree.showPopIcon,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
