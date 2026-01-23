import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'
import { useAtomValue } from 'jotai'
import {
  copyingAtom,
  movingAtom,
  store as jotaiStore,
  treeTpopkontrzaehlGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.tsx'

const getLabelRightElements = ({ copyingId, movingId, tpopkontrId }) => {
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

export const useTpopfreiwkontrNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId

  const tpopkontrzaehlGqlFilterForTree = useAtomValue(
    treeTpopkontrzaehlGqlFilterForTreeAtom,
  )

  const { data, refetch } = useQuery({
    queryKey: [
      'treeTpopfreiwkontr',
      tpopkontrId,
      tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavTpopfreiwkontrQuery(
            $tpopkontrId: UUID!
            $tpopkontrzaehlFilter: TpopkontrzaehlFilter!
          ) {
            tpopkontrById(id: $tpopkontrId) {
              id
              label: labelEkf
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
  useEffect(() => {
    const unsub = jotaiStore.sub(
      treeTpopkontrzaehlGqlFilterForTreeAtom,
      refetch,
    )
    return unsub
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
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

  const label = data?.data?.tpopkontrById?.label
  const tpopkontrzaehlCount =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.totalCount ?? 0
  const filteredTpopkontrzaehlCount =
    data?.data?.tpopkontrById?.filteredTpopkontrzaehls?.totalCount ?? 0
  const filesCount =
    data?.data?.tpopkontrById?.tpopkontrFilesByTpopkontrId?.totalCount ?? 0

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
        component: NodeWithList,
        hasChildren: !!filteredTpopkontrzaehlCount,
        alwaysOpen: true,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        treeNodeType: 'folder',
        treeMenuType: 'dateienFolder',
        treeId: `${tpopkontrId}DateienFolder`,
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
        component: Node,
        hasChildren: false,
      },
    ],
  }

  return navData
}
