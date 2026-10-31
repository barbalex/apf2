import { useEffect, useState } from 'react'
import { apiCount, apiFetch, rpcCount } from './api.ts'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import { copyingAtom, movingAtom, store } from '../store/index.ts'
import { getTpopkontrzaehlGqlFilterForTree } from './getTpopkontrzaehlGqlFilterForTree.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'

const getLabelRightElements = ({
  copyingId,
  movingId,
  tpopkontrId,
}: {
  copyingId: string | null
  movingId: string | null
  tpopkontrId: string
}) => {
  const labelRightElements = []
  const isMoving = movingId === tpopkontrId
  if (isMoving) {
    labelRightElements.push(MovingIcon)
  }
  const isCopying = copyingId === tpopkontrId
  if (isCopying) {
    labelRightElements.push(CopyingIcon)
  }

  return labelRightElements
}

export const useTpopfreiwkontrNavData = (
  props?:
    | {
        projId?: string | undefined
        apId?: string | undefined
        popId?: string | undefined
        tpopId?: string | undefined
        tpopkontrId?: string | undefined
      }
    | undefined,
) => {
  const params = useParams()
  const projId = props?.projId ?? params.projId ?? ''
  const apId = props?.apId ?? params.apId ?? ''
  const popId = props?.popId ?? params.popId ?? ''
  const tpopId = props?.tpopId ?? params.tpopId ?? ''
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId ?? ''
  const tpopkontrzaehlGqlFilterForTree =
    getTpopkontrzaehlGqlFilterForTree(tpopkontrId)

  const { data } = useSuspenseQuery({
    queryKey: [
      'treeTpopfreiwkontr',
      tpopkontrId,
      tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: async () => {
      // phase 5: the former tpopkontrzaehlsByTpopkontrId relation constraint
      // merges into the cascade filter; sibling keys are ANDed by compile_filter
      const filter = {
        ...tpopkontrzaehlGqlFilterForTree,
        tpopkontrByTpopkontrId: {
          ...((
            tpopkontrzaehlGqlFilterForTree as {
              tpopkontrByTpopkontrId?: object
            }
          ).tpopkontrByTpopkontrId ?? {}),
          id: { equalTo: tpopkontrId },
        },
      }
      const [kontr, zaehlCount, filteredZaehlCount, filesCount] =
        await Promise.all([
          apiFetch<{ id: string; label: string | null }[]>(
            `/q_tpopkontr?id=eq.${tpopkontrId}&select=id,label:label_ekf`,
          ),
          apiCount(`/q_tpopkontrzaehl?tpopkontr_id=eq.${tpopkontrId}`),
          rpcCount('query_tpopkontrzaehl', { p_filter: filter }),
          apiCount(`/tpopkontr_file?tpopkontr_id=eq.${tpopkontrId}`),
        ])
      return {
        tpopkontrById: {
          id: tpopkontrId,
          label: kontr?.[0]?.label ?? null,
          tpopkontrzaehlsByTpopkontrId: { totalCount: zaehlCount },
          filteredTpopkontrzaehls: { totalCount: filteredZaehlCount },
          tpopkontrFilesByTpopkontrId: { totalCount: filesCount },
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

  const label = data.tpopkontrById?.label
  const tpopkontrzaehlCount =
    data.tpopkontrById?.tpopkontrzaehlsByTpopkontrId.totalCount
  const filteredTpopkontrzaehlCount =
    data.tpopkontrById?.filteredTpopkontrzaehls.totalCount
  const filesCount = data.tpopkontrById?.tpopkontrFilesByTpopkontrId.totalCount

  const labelRightElements = getLabelRightElements({
    copyingId: copying.id,
    movingId: moving.id,
    tpopkontrId,
  })

  const navData = {
    id: tpopkontrId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${tpopkontrId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'tpopfreiwkontr',
    treeId: tpopkontrId,
    treeTableId: tpopkontrId,
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
      tpopkontrId,
    ],
    fetcherName: 'useTpopfreiwkontrNavData',
    fetcherParams: { projId, apId, popId, tpopId, tpopkontrId },
    singleElementName: 'Freiwilligen-Kontrolle',
    hasChildren: true,
    childrenAreFolders: true,
    labelRightElements:
      labelRightElements.length ? labelRightElements : undefined,
    // leave totalCount undefined as the menus are folders
    menus: [
      {
        id: 'Freiwilligen-Kontrolle',
        label: `Freiwilligen-Kontrolle`,
        isSelf: true,
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      },
      {
        id: 'Zaehlungen',
        label: `Zählungen (${filteredTpopkontrzaehlCount}/${tpopkontrzaehlCount})`,
        hideInNavList: true,
        treeNodeType: 'folder',
        treeMenuType: 'tpopfreiwkontrzaehlFolder',
        treeId: `${tpopkontrId}TpopfreiwkontrzaehlFolder`,
        treeTableId: tpopkontrId,
        treeParentTableId: tpopkontrId,
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
          tpopkontrId,
          'Zaehlungen',
        ],
        fetcherName: 'useTpopfreiwkontrzaehlsNavData',
        fetcherParams: { projId, apId, popId, tpopId, tpopkontrId },
        hasChildren: !!filteredTpopkontrzaehlCount,
        alwaysOpen: true,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'dateienFolder',
        treeId: `${tpopkontrId}DateienFolder`,
        treeTableId: tpopkontrId,
        treeParentTableId: tpopkontrId,
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
          tpopkontrId,
          'Dateien',
        ],
        hasChildren: false,
      },
    ],
  }

  return navData
}
