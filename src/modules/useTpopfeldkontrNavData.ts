import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import {
  copyingAtom,
  copyingBiotopAtom,
  movingAtom,
  store,
  treeTpopkontrzaehlGqlFilterForTreeAtom,
} from '../store/index.ts'

import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'
import { BiotopCopyingIcon } from '../components/NavElements/BiotopCopyingIcon.tsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.tsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

const getLabelRightElements = ({
  copyingId,
  copyingBiotopId,
  movingId,
  tpopkontrId,
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
  const isCopyingBiotop = copyingBiotopId === tpopkontrId
  if (isCopyingBiotop) {
    labelRightElements.push(BiotopCopyingIcon)
  }

  return labelRightElements
}

export const useTpopfeldkontrNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId

  const moving = useAtomValue(movingAtom)
  const copying = useAtomValue(copyingAtom)
  const copyingBiotop = useAtomValue(copyingBiotopAtom)
  const tpopkontrzaehlGqlFilterForTree = useAtomValue(
    treeTpopkontrzaehlGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: [
      'treeTpopfeldkontr',
      tpopkontrId,
      tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavTpopfeldkontrQuery(
            $tpopkontrId: UUID!
            $tpopkontrzaehlFilter: TpopkontrzaehlFilter!
          ) {
            tpopkontrById(id: $tpopkontrId) {
              id
              label: labelEk
              tpopkontrzaehlsByTpopkontrId {
                totalCount
              }
              tpopkontrFilesByTpopkontrId {
                totalCount
              }
              filteredTpopkontrzaehls: tpopkontrzaehlsByTpopkontrId(
                filter: $tpopkontrzaehlFilter
              ) {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopkontrId,
          tpopkontrzaehlFilter: tpopkontrzaehlGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)
  useEffect(
    () => {
      const unsub = store.sub(copyingBiotopAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = store.sub(movingAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  useEffect(
    () => {
      const unsub = store.sub(copyingAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const label = data?.data?.tpopkontrById?.label
  const tpopkontrzaehlCount =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.totalCount ?? 0
  const filteredTpopkontrzaehlCount =
    data?.data?.tpopkontrById?.filteredTpopkontrzaehls?.totalCount ?? 0
  const filesCount =
    data?.data?.tpopkontrById?.tpopkontrFilesByTpopkontrId?.totalCount ?? 0

  const labelRightElements = getLabelRightElements({
    copyingId: copying.id,
    copyingBiotopId: copyingBiotop.id,
    movingId: moving.id,
    tpopkontrId,
  })

  const navData = {
    id: tpopkontrId,
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}`,
    label,
    treeNodeType: 'table',
    treeMenuType: 'tpopfeldkontr',
    treeId: tpopkontrId,
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
      tpopkontrId,
    ],
    fetcherName: 'useTpopfeldkontrNavData',
    fetcherParams: { projId, apId, popId, tpopId, tpopkontrId },
    treeSingleElementName: 'Feld-Kontrolle',
    hasChildren: true,
    childrenAreFolders: true,
    labelRightElements: labelRightElements.length
      ? labelRightElements
      : undefined,
    component: NodeWithList,
    menus: [
      {
        id: 'Feld-Kontrolle',
        label: `Feld-Kontrolle`,
        isSelf: true,
        labelRightElements: labelRightElements.length
          ? labelRightElements
          : undefined,
      },
      {
        id: 'Zaehlungen',
        label: `Zählungen (${filteredTpopkontrzaehlCount}/${tpopkontrzaehlCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopfeldkontrzaehlFolder',
        treeId: `${tpopkontrId}TpopfeldkontrzaehlFolder`,
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
          'Feld-Kontrollen',
          tpopkontrId,
          'Zaehlungen',
        ],
        fetcherName: 'useTpopfeldkontrzaehlsNavData',
        fetcherParams: { projId, apId, popId, tpopId, tpopkontrId },
        component: NodeWithList,
        hasChildren: !!filteredTpopkontrzaehlCount,
        alwaysOpen: true,
      },
      {
        id: 'Biotop',
        label: `Biotop`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopkontrBiotopFolder',
        treeId: `${tpopkontrId}TpopkontrBiotopFolder`,
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
          'Feld-Kontrollen',
          tpopkontrId,
          'Biotop',
        ],
        component: Node,
        hasChildren: false,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'tpopfeldkontrDateienFolder',
        treeId: `${tpopkontrId}TpopfeldkontrDateienFolder`,
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
          'Feld-Kontrollen',
          tpopkontrId,
          'Dateien',
        ],
        component: Node,
        hasChildren: false,
      },
    ],
  }

  return navData
}
