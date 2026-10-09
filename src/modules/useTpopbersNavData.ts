import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getTpopberGqlFilterForTree } from './getTpopberGqlFilterForTree.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopbersNavData = (props?: { projId?: string | undefined; apId?: string | undefined; popId?: string | undefined; tpopId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = (props?.projId ?? params.projId ?? '')
  const apId = (props?.apId ?? params.apId ?? '')
  const popId = (props?.popId ?? params.popId ?? '')
  const tpopId = (props?.tpopId ?? params.tpopId ?? '')

  // Get filter before useQuery so changes trigger refetch
  const tpopberGqlFilterForTree = getTpopberGqlFilterForTree(tpopId)

  const { data } = useSuspenseQuery({
    queryKey: ['treeTpopber', tpopId, tpopberGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query TreeTpopbersQuery(
            $tpopbersFilter: TpopberFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopbersByTpopId(filter: $tpopbersFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                }
              }
              totalCount: tpopbersByTpopId {
                totalCount
              }
            }
          }
        `),
        variables: {
          tpopbersFilter: tpopberGqlFilterForTree,
          tpopId,
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
    },
  })

  const count = data.tpopById?.tpopbersByTpopId?.nodes?.length ?? 0
  const totalCount = data.tpopById?.totalCount.totalCount

  const navData = {
    id: 'Kontroll-Berichte',
    listFilter: 'tpopber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Kontroll-Berichte`,
    label: `Kontroll-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    menuType: 'tpopberFolder',
    treeId: `${tpopId}TpopberFolder`,
    treeTableId: tpopId,
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
      'Kontroll-Berichte',
    ],
    hasChildren: count > 0,
    component: NodeWithList,
    menus: data.tpopById?.tpopbersByTpopId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'tpopber',
      treeId: p?.id,
      treeTableId: p?.id,
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
        'Kontroll-Berichte',
        p?.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
