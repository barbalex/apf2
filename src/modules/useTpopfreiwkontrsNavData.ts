import { apiCount, apiFetch } from './api.ts'
import { useEffect, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import {
  copyingAtom,
  movingAtom,
  store,
  treeEkfGqlFilterForTreeAtom,
} from '../store/index.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'

export const useTpopfreiwkontrsNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
        tpopId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''
  const tpopId = props?.tpopId ?? params.tpopId ?? ''

  const ekfGqlFilterForTree = useAtomValue(treeEkfGqlFilterForTreeAtom)

  const { data } = useSuspenseQuery({
    queryKey: ['treeTpopfreiwkontr', tpopId, ekfGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former tpopkontrsByTpopId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...ekfGqlFilterForTree,
        tpopByTpopId: {
          ...((ekfGqlFilterForTree as { tpopByTpopId?: object }).tpopByTpopId ??
            {}),
          id: { equalTo: tpopId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<{ id: string; label: string | null }[]>(
          `/rpc/query_tpopkontr?select=id,label:label_ekf`,
          {
            method: 'POST',
            body: JSON.stringify({
              p_filter: filter,
              p_order: [
                { field: 'jahr', dir: 'asc' },
                { field: 'datum', dir: 'asc' },
              ],
            }),
          },
        ),
        apiCount(`/q_tpopkontr?tpop_id=eq.${tpopId}`),
      ])
      return {
        tpopById: {
          id: tpopId,
          tpopkontrsByTpopId: { nodes: nodes ?? [] },
          totalCount: { totalCount },
        },
      }
    },
  })

  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)
  const copying = useAtomValue(copyingAtom)
  const moving = useAtomValue(movingAtom)
  useEffect(() => {
    const unsub = store.sub(movingAtom, rerender)
    return unsub
  }, [])
  useEffect(() => {
    const unsub = store.sub(copyingAtom, rerender)
    return unsub
  }, [])

  const count = data.tpopById?.tpopkontrsByTpopId.nodes.length
  const totalCount = data.tpopById?.totalCount.totalCount

  const navData = {
    id: 'Freiwilligen-Kontrollen',
    listFilter: 'tpopkontr',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen`,
    label: `Freiwilligen-Kontrollen (${count}/${totalCount})`,
    labelShort: `EKF (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopfreiwkontrFolder',
    treeId: `${tpopId}TpopfreiwkontrFolder`,
    treeTableId: tpopId,
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
    menus: data.tpopById?.tpopkontrsByTpopId.nodes.map((p) => {
      const labelRightElements = []
      const isMoving = moving.id === p?.id
      if (isMoving) {
        labelRightElements.push(MovingIcon)
      }
      const isCopying = copying.id === p?.id
      if (isCopying) {
        labelRightElements.push(CopyingIcon)
      }

      return {
        id: p?.id,
        label: p?.label,
        treeNodeType: 'table',
        treeMenuType: 'tpopfreiwkontr',
        treeId: p?.id,
        treeTableId: p?.id,
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
          p?.id,
        ],
        fetcherName: 'useTpopfreiwkontrNavData',
        fetcherParams: { projId, apId, popId, tpopId, tpopkontrId: p?.id },
        singleElementName: 'Freiwilligen-Kontrolle',
        hasChildren: true,
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      }
    }),
  }

  return navData
}
