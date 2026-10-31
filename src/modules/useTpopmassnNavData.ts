import { useEffect, useState } from 'react'
import { apiCount, apiFetch } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import { copyingAtom, movingAtom, store } from '../store/index.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'

const getLabelRightElements = ({
  copyingId,
  movingId,
  tpopmassnId,
}: {
  copyingId: string | null
  movingId: string | null
  tpopmassnId: string
}) => {
  const labelRightElements = []
  const isMoving = movingId === tpopmassnId
  if (isMoving) {
    labelRightElements.push(MovingIcon)
  }
  const isCopying = copyingId === tpopmassnId
  if (isCopying) {
    labelRightElements.push(CopyingIcon)
  }

  return labelRightElements
}

export const useTpopmassnNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
        tpopId?: string | undefined
        tpopmassnId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''
  const tpopId = props?.tpopId ?? params.tpopId ?? ''
  const tpopmassnId = props?.tpopmassnId ?? params.tpopmassnId ?? ''

  const { data } = useSuspenseQuery({
    queryKey: ['treeTpopmassn', tpopmassnId],
    queryFn: async () => {
      const [massn, filesCount] = await Promise.all([
        apiFetch<
          {
            id: string
            label: string | null
            zieleinheit_anzahl: number | null
            tpopkontrzaehl_einheit_werte_by_zieleinheit_einheit: {
              text: string | null
            } | null
          }[]
        >(
          `/q_tpopmassn?id=eq.${tpopmassnId}&select=id,label,zieleinheitAnzahl:zieleinheit_anzahl,tpopkontrzaehlEinheitWerteByZieleinheitEinheit:tpopkontrzaehl_einheit_werte_by_zieleinheit_einheit`,
        ),
        apiCount(`/tpopmassn_file?tpopmassn_id=eq.${tpopmassnId}`),
      ])
      const row = massn?.[0]
      return {
        tpopmassnById: {
          id: row?.id,
          label: row?.label,
          zieleinheitAnzahl: row?.zieleinheit_anzahl,
          tpopkontrzaehlEinheitWerteByZieleinheitEinheit:
            row?.tpopkontrzaehl_einheit_werte_by_zieleinheit_einheit ?? null,
          tpopmassnFilesByTpopmassnId: { totalCount: filesCount },
        },
      }
    },
  })

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

  const zielAnzahl = data.tpopmassnById?.zieleinheitAnzahl
  const zielEinheit =
    data.tpopmassnById?.tpopkontrzaehlEinheitWerteByZieleinheitEinheit?.text
  const addEinheitToLabel = !!zielAnzahl && !!zielEinheit
  const label =
    data.tpopmassnById?.label +
    (addEinheitToLabel ? `\n${zielEinheit}: ${zielAnzahl}` : '')
  const filesCount = data.tpopmassnById?.tpopmassnFilesByTpopmassnId.totalCount

  const labelRightElements = getLabelRightElements({
    copyingId: copying.id,
    movingId: moving.id,
    tpopmassnId,
  })

  const navData = {
    id: tpopmassnId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen/${tpopmassnId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'tpopmassn',
    treeId: tpopmassnId,
    treeTableId: tpopmassnId,
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
      tpopmassnId,
    ],
    hasChildren: true,
    childrenAreFolders: true,
    fetcherName: 'useTpopmassnNavData',
    fetcherParams: { projId, apId, popId, tpopId, tpopmassnId },
    labelRightElements:
      labelRightElements.length ? labelRightElements : undefined,
    menus: [
      {
        id: 'Massnahme',
        label: `Massnahme`,
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
          tpopmassnId,
          'Massnahme',
        ],
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
        isSelf: true,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopmassnDateienFolder',
        treeId: `${tpopmassnId}TpopmassnDateienFolder`,
        treeTableId: tpopmassnId,
        treeParentTableId: tpopmassnId,
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
          tpopmassnId,
          'Dateien',
        ],
        hasChildren: false,
      },
    ],
  }

  return navData
}
