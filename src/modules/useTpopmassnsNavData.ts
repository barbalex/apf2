import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
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
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopmassnsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const moving = useAtomValue(movingAtom)
  const tpopmassnGqlFilterForTree = useAtomValue(
    treeTpopmassnGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: ['treeTpopmassn', tpopId, tpopmassnGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeTpopmassnsQuery(
            $tpopmassnsFilter: TpopmassnFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              tpopmassnsByTpopId(
                filter: $tpopmassnsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                nodes {
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
                }
              }
              totalCount: tpopmassnsByTpopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopmassnsFilter: tpopmassnGqlFilterForTree,
          tpopId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  const [, setRerenderer] = useState(0)
  const rerender = () => setRerenderer((prev) => prev + 1)
  useEffect(
    () => {
      const unsub = store.sub(movingAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const copying = useAtomValue(copyingAtom)
  useEffect(
    () => {
      const unsub = store.sub(copyingAtom, rerender)
      return unsub
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data.tpopById.tpopmassnsByTpopId.nodes.length
  const totalCount = data.tpopById.totalCount.totalCount

  const navData = {
    id: 'Massnahmen',
    listFilter: 'tpopmassn',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen`,
    label: `Massnahmen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopmassnFolder',
    treeId: `${tpopId}TpopmassnFolder`,
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
    component: NodeWithList,
    menus: data.tpopById.tpopmassnsByTpopId.nodes.map((p) => {
      const labelRightElements = []
      const isMoving = moving.id === p.id
      if (isMoving) {
        labelRightElements.push(MovingIcon)
      }
      const isCopying = copying.id === p.id
      if (isCopying) {
        labelRightElements.push(CopyingIcon)
      }

      const zielAnzahl = p.zieleinheitAnzahl
      const zielEinheit = p.tpopkontrzaehlEinheitWerteByZieleinheitEinheit?.text
      const addEinheitToLabel = !!zielAnzahl && !!zielEinheit
      const label =
        p.label + (addEinheitToLabel ? `\n${zielEinheit}: ${zielAnzahl}` : '')

      return {
        id: p.id,
        label,
        treeNodeType: 'table',
        treeMenuType: 'tpopmassn',
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
          'Massnahmen',
          p.id,
        ],
        hasChildren: true,
        fetcherName: 'useTpopmassnNavData',
        fetcherParams: { projId, apId, popId, tpopId, tpopmassnId: p.id },
        labelRightElements:
          labelRightElements.length ? labelRightElements : undefined,
      }
    }),
  }

  return navData
}
