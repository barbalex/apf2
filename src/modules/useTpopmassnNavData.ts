import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'
import { copyingAtom, movingAtom, store } from '../store/index.ts'
import { MovingIcon } from '../components/NavElements/MovingIcon.tsx'
import { CopyingIcon } from '../components/NavElements/CopyingIcon.tsx'
import { Node } from '../components/Projekte/TreeContainer/Tree/Node.tsx'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

const getLabelRightElements = ({ copyingId, movingId, tpopmassnId }) => {
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

export const useTpopmassnNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopmassnId = props?.tpopmassnId ?? params.tpopmassnId

  const { data } = useQuery({
    queryKey: ['treeTpopmassn', tpopmassnId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavTpopmassnQuery($tpopmassnId: UUID!) {
            tpopmassnById(id: $tpopmassnId) {
              id
              label
              zieleinheitAnzahl
              tpopkontrzaehlEinheitWerteByZieleinheitEinheit {
                text
                # ekzaehleinheitsByZaehleinheitId {
                #   nodes {
                #     zielrelevant
                #   }
                # }
              }
              tpopmassnFilesByTpopmassnId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopmassnId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)
  const copying = useAtomValue(copyingAtom)
  const moving = useAtomValue(movingAtom)
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

  const zielAnzahl = data.tpopmassnById.zieleinheitAnzahl
  const zielEinheit =
    data.tpopmassnById.tpopkontrzaehlEinheitWerteByZieleinheitEinheit?.text
  const addEinheitToLabel = !!zielAnzahl && !!zielEinheit
  const label =
    data.tpopmassnById.label +
    (addEinheitToLabel ? `\n${zielEinheit}: ${zielAnzahl}` : '')
  const filesCount = data.tpopmassnById.tpopmassnFilesByTpopmassnId.totalCount

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
    component: NodeWithList,
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
        component: Node,
      },
    ],
  }

  return navData
}
