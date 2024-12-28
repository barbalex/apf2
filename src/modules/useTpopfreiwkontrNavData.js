import { useMemo, useContext, useEffect, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.jsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.jsx'

export const useTpopfreiwkontrNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpopfreiwkontr',
      tpopkontrId,
      store.tree.tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
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
          tpopkontrzaehlFilter: store.tree.tpopkontrzaehlGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.tpopkontrzaehlGqlFilterForTree, refetch),
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

  const label = data?.data?.tpopkontrById?.label
  const tpopkontrzaehlCount =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.totalCount ?? 0
  const filteredTpopkontrzaehlCount =
    data?.data?.tpopkontrById?.filteredTpopkontrzaehls?.totalCount ?? 0
  const filesCount =
    data?.data?.tpopkontrById?.tpopkontrFilesByTpopkontrId?.totalCount ?? 0

  const labelRightElements = useMemo(() => {
    const labelRightElements = []
    const isMoving = store.moving.id === tpopkontrId
    if (isMoving) {
      labelRightElements.push(MovingIcon)
    }
    const isCopying = store.copying.id === tpopkontrId
    if (isCopying) {
      labelRightElements.push(CopyingIcon)
    }

    return labelRightElements
  }, [store.copying.id, store.moving.id, tpopkontrId])

  const navData = useMemo(
    () => ({
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
      labelRightElements: labelRightElements.length
        ? labelRightElements
        : undefined,
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Freiwilligen-Kontrolle',
          label: `Freiwilligen-Kontrolle`,
          isSelf: true,
          labelRightElements: labelRightElements.length
            ? labelRightElements
            : undefined,
        },
        {
          id: 'Zaehlungen',
          label: `Zählungen (${isLoading ? '...' : `${filteredTpopkontrzaehlCount}/${tpopkontrzaehlCount}`})`,
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
    }),
    [
      apId,
      filesCount,
      filteredTpopkontrzaehlCount,
      isLoading,
      label,
      labelRightElements,
      popId,
      projId,
      tpopId,
      tpopkontrId,
      tpopkontrzaehlCount,
    ],
  )

  return { isLoading, error, navData }
}
