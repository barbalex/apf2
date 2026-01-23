import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { store, treeTpopmassnberGqlFilterForTreeAtom } from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopmassnbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const tpopmassnberGqlFilterForTree = useAtomValue(
    treeTpopmassnberGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: ['treeTpopmassnber', tpopId, tpopmassnberGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeTpopmassnbersQuery(
            $tpopmassnbersFilter: TpopmassnberFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopmassnbersByTpopId(
                filter: $tpopmassnbersFilter
                orderBy: LABEL_ASC
              ) {
                nodes {
                  id
                  label
                }
              }
              totalCount: tpopmassnbersByTpopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopmassnbersFilter: tpopmassnberGqlFilterForTree,
          tpopId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.tpopById?.tpopmassnbersByTpopId?.nodes?.length ?? 0
  const totalCount = data?.data?.tpopById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Massnahmen-Berichte',
    listFilter: 'tpopmassnber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen-Berichte`,
    label: `Massnahmen-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'tpopmassnberFolder',
    treeId: `${tpopId}TpopmassnberFolder`,
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
      'Massnahmen-Berichte',
    ],
    hasChildren: !!count,
    component: NodeWithList,
    menus: (data?.data?.tpopById?.tpopmassnbersByTpopId?.nodes ?? []).map(
      (p) => ({
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'tpopmassnber',
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
          'Massnahmen-Berichte',
          p.id,
        ],
        hasChildren: false,
      }),
    ),
  }

  return navData
}
