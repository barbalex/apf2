import { useMemo, useEffect, useContext, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

import { TpopIcon100 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/100.jsx'
import { TpopIcon100Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/100Highlighted.jsx'
import { TpopIcon101 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/101.jsx'
import { TpopIcon101Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/101Highlighted.jsx'
import { TpopIcon200 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/200.jsx'
import { TpopIcon200Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/200Highlighted.jsx'
import { TpopIcon201 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/201.jsx'
import { TpopIcon201Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/201Highlighted.jsx'
import { TpopIcon202 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/202.jsx'
import { TpopIcon202Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/202Highlighted.jsx'
import { TpopIcon300 } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/300.jsx'
import { TpopIcon300Highlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroupSymbols/300Highlighted.jsx'
import { TpopIcon } from '../components/Projekte/Karte/layers/Tpop/tpop.jsx'
import { TpopIconHighlighted } from '../components/Projekte/Karte/layers/Tpop/tpopHighlighted.jsx'
import { TpopIconU } from '../components/Projekte/Karte/layers/Tpop/statusGroup/u.jsx'
import { TpopIconUHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/uHighlighted.jsx'
import { TpopIconA } from '../components/Projekte/Karte/layers/Tpop/statusGroup/a.jsx'
import { TpopIconAHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/aHighlighted.jsx'
import { TpopIconP } from '../components/Projekte/Karte/layers/Tpop/statusGroup/p.jsx'
import { TpopIconPHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/pHighlighted.jsx'
import { TpopIconQ } from '../components/Projekte/Karte/layers/Tpop/statusGroup/q.jsx'
import { TpopIconQHighlighted } from '../components/Projekte/Karte/layers/Tpop/statusGroup/qHighlighted.jsx'

import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.jsx'

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

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeTpop', popId, store.tree.tpopGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopsQuery($tpopsFilter: TpopFilter!, $popId: UUID!) {
            popById(id: $popId) {
              id
              tpopsByPopId(
                filter: $tpopsFilter
                orderBy: [NR_ASC, FLURNAME_ASC]
              ) {
                totalCount
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
          tpopsFilter: store.tree.tpopGqlFilterForTree,
          popId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.tpopGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [, setRerenderer] = useState(0)
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])
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

  const count = data?.data?.popById?.tpopsByPopId?.nodes?.length ?? 0
  const totalCount = data?.data?.popById?.totalCount?.totalCount ?? 0

  const tpopIconName = store.map.tpopIcon

  const navData = useMemo(
    () => ({
      id: 'Teil-Populationen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen`,
      label: `Teil-Populationen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus: (data?.data?.popById?.tpopsByPopId?.nodes ?? []).map((p) => {
        const labelRightElements = []
        const isMoving = store.moving.id === p.id
        if (isMoving) {
          labelRightElements.push(MovingIcon)
        }
        const isCopying = store.copying.id === p.id
        if (isCopying) {
          labelRightElements.push(CopyingIcon)
        }

        const iconIsHighlighted = p.id === tpopId
        const TpopIcon =
          p.status ?
            iconIsHighlighted ?
              tpopIcons[tpopIconName][p.status + 'Highlighted']
            : tpopIcons[tpopIconName][p.status]
          : iconIsHighlighted ? TpopIconQHighlighted
          : TpopIconQ

        return {
          id: p.id,
          label: p.label,
          status: p.status,
          labelLeftElements: store.tree.showTpopIcon ? [TpopIcon] : undefined,
          labelRightElements:
            labelRightElements.length ? labelRightElements : undefined,
        }
      }),
    }),
    [
      apId,
      count,
      data?.data?.popById?.tpopsByPopId?.nodes,
      isLoading,
      popId,
      projId,
      store.copying.id,
      store.moving.id,
      store.tree.showTpopIcon,
      totalCount,
      tpopIconName,
      tpopId,
    ],
  )

  return { isLoading, error, navData }
}
