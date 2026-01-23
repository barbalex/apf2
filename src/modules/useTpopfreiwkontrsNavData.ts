import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import {
  copyingAtom,
  movingAtom,
  store as jotaiStore,
  treeEkfGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'

export const useTpopfreiwkontrsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const ekfGqlFilterForTree = useAtomValue(treeEkfGqlFilterForTreeAtom)

  const { data, refetch } = useQuery({
    queryKey: ['treeTpopfreiwkontr', tpopId, ekfGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
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
          ekfsFilter: ekfGqlFilterForTree,
          tpopId,
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
  useEffect(
    () => {
      const unsub = jotaiStore.sub(treeEkfGqlFilterForTreeAtom, refetch)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)
  const copying = useAtomValue(copyingAtom)
  const moving = useAtomValue(movingAtom)
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

  const count = data?.data?.tpopById?.tpopkontrsByTpopId?.totalCount ?? 0
  const totalCount = data?.data?.tpopById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Freiwilligen-Kontrollen',
    listFilter: 'tpopkontr',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen`,
    label: `Freiwilligen-Kontrollen (${count}/${totalCount})`,
    labelShort: `EKF (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopfreiwkontrFolder',
    treeId: `${tpopId}TpopfreiwkontrFolder`,
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
    hasChildren: !!count,
    menus: (data?.data?.tpopById?.tpopkontrsByTpopId?.nodes ?? []).map((p) => {
      const labelRightElements = []
      const isMoving = moving.id === p.id
      if (isMoving) {
        labelRightElements.push(MovingIcon)
      }
      const isCopying = copying.id === p.id
      if (isCopying) {
        labelRightElements.push(CopyingIcon)
      }

      return {
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'tpopfreiwkontr',
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
          'Freiwilligen-Kontrollen',
          p.id,
        ],
        fetcherName: 'useTpopfreiwkontrNavData',
        fetcherParams: { projId, apId, popId, tpopId, tpopkontrId: p.id },
        singleElementName: 'Freiwilligen-Kontrolle',
        hasChildren: true,
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      }
    }),
  }

  return navData
}
