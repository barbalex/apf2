import { useEffect, useContext, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.jsx'
import { BiotopCopyingIcon } from '../components/NavElements/BiotopCopyingIcon.jsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useTpopfeldkontrsNavData = (props) => {
  const apolloClient = useApolloClient()

  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeTpopfeldkontr', tpopId, store.tree.ekGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopfeldkontrsQuery(
            $eksFilter: TpopkontrFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopkontrsByTpopId(
                filter: $eksFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                totalCount
                nodes {
                  id
                  label: labelEk
                }
              }
              totalCount: tpopkontrsByTpopId(
                filter: {
                  typ: { distinctFrom: "Freiwilligen-Erfolgskontrolle" }
                }
              ) {
                totalCount
              }
            }
          }
        `,
        variables: {
          eksFilter: store.tree.ekGqlFilterForTree,
          tpopId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.ekGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)
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

  const navData = {
    id: 'Feld-Kontrollen',
    listFilter: 'tpopkontr',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen`,
    label: `Feld-Kontrollen (${isLoading ? '...' : `${count}/${totalCount}`})`,
    labelShort: `EK (${isLoading ? '...' : `${count}/${totalCount}`})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopfeldkontr',
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
    hasChildren: !!count,
    component: NodeWithList,
    menus: (data?.data?.tpopById?.tpopkontrsByTpopId?.nodes ?? []).map((p) => {
      const labelRightElements = []
      const isMoving = store.moving.id === p.id
      if (isMoving) {
        labelRightElements.push(MovingIcon)
      }
      const isCopying = store.copying.id === p.id
      if (isCopying) {
        labelRightElements.push(CopyingIcon)
      }
      const isCopyingBiotop = store.copyingBiotop.id === p.id
      if (isCopyingBiotop) {
        labelRightElements.push(BiotopCopyingIcon)
      }

      return {
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'tpopfeldkontr',
        treeId: p.id,
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
          p.id,
        ],
        fetcherName: 'useTpopfeldkontrNavData',
        fetcherParams: { projId, apId, popId, tpopId, tpopkontrId: p.id },
        treeSingleElementName: 'Feld-Kontrolle',
        hasChildren: true,
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      }
    }),
  }

  return { isLoading, error, navData }
}
