import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store,
  treeTpopkontrzaehlGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopfeldkontrzaehlsNavData = (props) => {
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
      return result
    },
    suspense: true,
  })

  const count =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes?.length ?? 0
  const totalCount = data?.data?.tpopkontrById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Zaehlungen',
    listFilter: 'tpopkontrzaehl',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/Zaehlungen`,
    label: `Zählungen (${count}/${totalCount})`,
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
    hasChildren: !!count,
    alwaysOpen: true,
    component: NodeWithList,
    menus: (
      data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes ?? []
    ).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopfeldkontrzaehl',
      treeId: p.id,
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
