import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { store } from '../store/index.ts'
import { getTpopkontrzaehlGqlFilterForTree } from './getTpopkontrzaehlGqlFilterForTree.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopfeldkontrzaehlsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId
  const tpopkontrzaehlGqlFilterForTree =
    getTpopkontrzaehlGqlFilterForTree(tpopkontrId)

  const { data } = useQuery({
    queryKey: [
      'treeTpopfeldkontrzaehl',
      tpopkontrId,
      tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeTpopfeldkontrzaehlsQuery(
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

  const count = data.tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes.length
  const totalCount = data.tpopkontrById.totalCount.totalCount

  const navData = {
    id: 'Zaehlungen',
    listFilter: 'tpopkontrzaehl',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/Zaehlungen`,
    label: `Zählungen (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopfeldkontrzaehlFolder',
    treeId: `${tpopkontrId}TpopfeldkontrzaehlFolder`,
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
      'Feld-Kontrollen',
      tpopkontrId,
      'Zaehlungen',
    ],
    fetcherName: 'useTpopfeldkontrzaehlsNavData',
    fetcherParams: { projId, apId, popId, tpopId, tpopkontrId },
    hasChildren: !!count,
    alwaysOpen: true,
    component: NodeWithList,
    menus: data.tpopkontrById.tpopkontrzaehlsByTpopkontrId.nodes.map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopfeldkontrzaehl',
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
        'Feld-Kontrollen',
        tpopkontrId,
        'Zaehlungen',
        p.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
