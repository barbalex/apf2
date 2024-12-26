import { useMemo, useContext, useEffect, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { MovingIcon } from '../components/NavElements/MovingIcon.jsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.jsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.jsx'

export const useTpopmassnNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopmassnId = props?.tpopmassnId ?? params.tpopmassnId

  const store = useContext(MobxContext)

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeTpopmassn', tpopmassnId],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavTpopmassnQuery($tpopmassnId: UUID!) {
            tpopmassnById(id: $tpopmassnId) {
              id
              label
              tpopmassnFilesByTpopmassnId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopmassnId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
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

  const label = data?.data?.tpopmassnById?.label
  data?.data?.tpopmassnById?.filteredBeobZugeordnet?.totalCount ?? 0
  const filesCount =
    data?.data?.tpopmassnById?.tpopmassnFilesByTpopmassnId?.totalCount ?? 0

  const labelRightElements = useMemo(() => {
    const labelRightElements = []
    const isMoving = store.moving.id === tpopmassnId
    if (isMoving) {
      labelRightElements.push(MovingIcon)
    }
    const isCopying = store.copying.id === tpopmassnId
    if (isCopying) {
      labelRightElements.push(CopyingIcon)
    }

    return labelRightElements
  }, [store.copying.id, store.moving.id, tpopmassnId])

  const navData = useMemo(
    () => ({
      id: tpopmassnId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen/${tpopmassnId}`,
      label,
      treeNodeType: 'table',
      treeMenuType: 'tpopmassn',
      treeId: tpopmassnId,
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
        'Massnahmen',
        tpopmassnId,
      ],
      hasChildren: true,
      childrenAreFolders: true,
      fetcherName: 'useTpopmassnNavData',
      fetcherParams: { projId, apId, popId, tpopId, tpopmassnId },
      labelRightElements: labelRightElements.length
        ? labelRightElements
        : undefined,
      // leave totalCount undefined as the menus are folders
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
          labelRightElements: labelRightElements.length
            ? labelRightElements
            : undefined,
          isSelf: true,
        },
        {
          id: 'Dateien',
          label: `Dateien (${filesCount})`,
          treeNodeType: 'folder',
          treeMenuType: 'tpopmassnDateienFolder',
          treeId: `${tpopmassnId}TpopmassnDateienFolder`,
          treeTableId: tpopmassnId,
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
          component: Node,
        },
      ],
    }),
    [
      apId,
      filesCount,
      label,
      labelRightElements,
      popId,
      projId,
      tpopId,
      tpopmassnId,
    ],
  )

  return { isLoading, error, navData }
}
