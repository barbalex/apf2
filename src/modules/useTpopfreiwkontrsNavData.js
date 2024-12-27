import { useMemo, useEffect, useContext, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'
import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.jsx'

export const useTpopfreiwkontrsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeTpopfreiwkontr', tpopId, store.tree.ekfGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopfreiwkontrsQuery(
            $ekfsFilter: TpopkontrFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopkontrsByTpopId(
                filter: $ekfsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                totalCount
                nodes {
                  id
                  label: labelEkf
                }
              }
              totalCount: tpopkontrsByTpopId(
                filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
              ) {
                totalCount
              }
            }
          }
        `,
        variables: {
          ekfsFilter: store.tree.ekfGqlFilterForTree,
          tpopId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.ekfGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [, setRerenderer] = useState(0)
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])
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

  const count = data?.data?.tpopById?.tpopkontrsByTpopId?.totalCount ?? 0
  const totalCount = data?.data?.tpopById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Freiwilligen-Kontrollen',
      listFilter: 'tpopkontr',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen`,
      label: `Freiwilligen-Kontrollen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      labelShort: `EKF (${isLoading ? '...' : `${count}/${totalCount}`})`,
      treeNodeType: 'folder',
      treeMenuType: 'tpopfreiwkontrFolder',
      treeId: `${tpopId}TpopfreiwkontrFolder`,
      treeTableId: tpopId,
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
      hasChildren: !!count,
      menus: (data?.data?.tpopById?.tpopkontrsByTpopId?.nodes ?? []).map(
        (p) => {
          const labelRightElements = []
          const isMoving = store.moving.id === p.id
          if (isMoving) {
            labelRightElements.push(MovingIcon)
          }
          const isCopying = store.copying.id === p.id
          if (isCopying) {
            labelRightElements.push(CopyingIcon)
          }

          return {
            id: p.id,
            label: p.label,
            treeNodeType: 'table',
            treeMenuType: 'tpopfreiwkontr',
            treeId: p.id,
            treeParentId: tpopId,
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
              p.id,
            ],
            fetcherName: 'useTpopfreiwkontrNavData',
            fetcherParams: { projId, apId, popId, tpopId, tpopkontrId: p.id },
            singleElementName: 'Freiwilligen-Kontrolle',
            hasChildren: true,
            labelRightElements: labelRightElements.length
              ? labelRightElements
              : undefined,
          }
        },
      ),
    }),
    [
      apId,
      count,
      data?.data?.tpopById?.tpopkontrsByTpopId?.nodes,
      isLoading,
      popId,
      projId,
      store.copying.id,
      store.moving.id,
      totalCount,
      tpopId,
    ],
  )

  return { isLoading, error, navData }
}
