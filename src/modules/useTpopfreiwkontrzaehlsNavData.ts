import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store,
  treeTpopkontrzaehlGqlFilterForTreeAtom,
} from '../store/index.ts'

export const useTpopfreiwkontrzaehlsNavData = (props) => {
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

  const { data } = useQuery({
    queryKey: [
      'treeTpopfreiwkontrzaehl',
      tpopkontrId,
      tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeTpopfreiwkontrzaehlsQuery(
            $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
            $tpopkontrId: UUID!
          ) {
            tpopkontrById(id: $tpopkontrId) {
              id
              tpopkontrzaehlsByTpopkontrId(
                filter: $tpopkontrzaehlsFilter
                orderBy: LABEL_ASC
              ) {
                nodes {
                  id
                  label
                }
              }
              totalCount: tpopkontrzaehlsByTpopkontrId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopkontrzaehlsFilter: tpopkontrzaehlGqlFilterForTree,
          tpopkontrId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const count =
    data.tpopkontrById.tpopkontrzaehlsByTpopkontrId?.nodes?.length
  const totalCount = data.tpopkontrById.totalCount.totalCount

  const navData = {
    id: 'Zaehlungen',
    listFilter: 'tpopkontrzaehl',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen/${tpopkontrId}/Zaehlungen`,
    label: `Zählungen (${count}/${totalCount})`,
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
    hasChildren: !!count,
    alwaysOpen: true,
    menus: (
      data.tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes
    ).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopfreiwkontrzaehl',
      treeId: p.id,
      treeTableId: p.id,
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
        p.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
