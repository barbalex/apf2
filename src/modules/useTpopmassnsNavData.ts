import { apiCount, apiFetch } from './api.ts'
import { useEffect, useState } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  copyingAtom,
  movingAtom,
  store,
  treeTpopmassnGqlFilterForTreeAtom,
} from '../store/index.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'

export const useTpopmassnsNavData = (
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

  const moving = useAtomValue(movingAtom)
  const tpopmassnGqlFilterForTree = useAtomValue(
    treeTpopmassnGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: ['treeTpopmassn', tpopId, tpopmassnGqlFilterForTree],
    queryFn: async () => {
      // phase 5: the former tpopmassnsByTpopId relation constraint merges into
      // the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...tpopmassnGqlFilterForTree,
        tpopByTpopId: {
          ...((tpopmassnGqlFilterForTree as { tpopByTpopId?: object })
            .tpopByTpopId ?? {}),
          id: { equalTo: tpopId },
        },
      }
      const [nodes, totalCount] = await Promise.all([
        apiFetch<
          {
            id: string
            label: string | null
            zieleinheitAnzahl: number | null
            tpopkontrzaehlEinheitWerteByZieleinheitEinheit: {
              text: string | null
            } | null
          }[]
        >(
          `/rpc/query_tpopmassn?select=id,label,zieleinheitAnzahl:zieleinheit_anzahl,tpopkontrzaehlEinheitWerteByZieleinheitEinheit:tpopkontrzaehl_einheit_werte_by_zieleinheit_einheit`,
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
        apiCount(`/q_tpopmassn?tpop_id=eq.${tpopId}`),
      ])
      return {
        tpopById: {
          id: tpopId,
          tpopmassnsByTpopId: { nodes: nodes ?? [] },
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
  useEffect(() => {
    const unsub = store.sub(movingAtom, rerender)
    return unsub
  }, [])
  const copying = useAtomValue(copyingAtom)
  useEffect(() => {
    const unsub = store.sub(copyingAtom, rerender)
    return unsub
  }, [])

  const count = data.tpopById?.tpopmassnsByTpopId.nodes.length
  const totalCount = data.tpopById?.totalCount.totalCount

  const navData = {
    id: 'Massnahmen',
    listFilter: 'tpopmassn',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen`,
    label: `Massnahmen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopmassnFolder',
    treeId: `${tpopId}TpopmassnFolder`,
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
      'Massnahmen',
    ],
    fetcherName: 'useTpopmassnsNavData',
    fetcherParams: { projId, apId, popId, tpopId },
    hasChildren: !!count,
    menus: data.tpopById?.tpopmassnsByTpopId.nodes.map((p) => {
      const labelRightElements = []
      const isMoving = moving.id === p?.id
      if (isMoving) {
        labelRightElements.push(MovingIcon)
      }
      const isCopying = copying.id === p?.id
      if (isCopying) {
        labelRightElements.push(CopyingIcon)
      }

      const zielAnzahl = p?.zieleinheitAnzahl
      const zielEinheit =
        p?.tpopkontrzaehlEinheitWerteByZieleinheitEinheit?.text
      const addEinheitToLabel = !!zielAnzahl && !!zielEinheit
      const label =
        p?.label + (addEinheitToLabel ? `\n${zielEinheit}: ${zielAnzahl}` : '')

      return {
        id: p?.id,
        label,
        treeNodeType: 'table',
        treeMenuType: 'tpopmassn',
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
          'Massnahmen',
          p?.id,
        ],
        hasChildren: true,
        fetcherName: 'useTpopmassnNavData',
        fetcherParams: { projId, apId, popId, tpopId, tpopmassnId: p?.id },
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      }
    }),
  }

  return navData
}
