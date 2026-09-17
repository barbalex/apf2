import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  treeApberuebersichtGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useApberuebersichtsNavData = (props?: { projId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()

  const params = useParams()
  const projId = props?.projId ?? params?.projId

  const apberuebersichtGqlFilterForTree = useAtomValue(
    treeApberuebersichtGqlFilterForTreeAtom,
  )

  const { data } = useSuspenseQuery({
    queryKey: ['treeApberuebersicht', apberuebersichtGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query NavApberuebersichtsQuery(
            $apberuebersichtFilter: ApberuebersichtFilter!
          ) {
            filtered: allApberuebersichts(
              filter: $apberuebersichtFilter
              orderBy: LABEL_ASC
            ) {
              totalCount
              nodes {
                id
                label
              }
            }
            unfiltered: allApberuebersichts {
              totalCount
            }
          }
        `),
        variables: {
          apberuebersichtFilter: apberuebersichtGqlFilterForTree,
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
    },
  })

  const count = data.filtered?.nodes.length
  const totalCount = data.unfiltered?.totalCount

  const navData = {
    id: 'AP-Berichte',
    listFilter: 'apberuebersicht',
    url: `/Daten/Projekte/${projId}/AP-Berichte`,
    label: 'AP-Berichte ' + `${count}/${totalCount}`,
    treeNodeType: 'folder',
    treeMenuType: 'apberuebersichtFolder',
    treeId: `${projId}/ApberuebersichtFolder`,
    treeTableId: projId,
    treeParentTableId: projId,
    treeUrl: ['Projekte', projId, 'AP-Berichte'],
    hasChildren: !!count,
    fetcherName: 'useApberuebersichtsNavData',
    fetcherParams: { projId },
    component: NodeWithList,
    menus: data.filtered?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'apberuebersicht',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: projId,
      treeUrl: ['Projekte', projId, 'AP-Berichte', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
