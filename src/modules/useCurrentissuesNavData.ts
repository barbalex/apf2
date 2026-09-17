import { graphql } from '../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'

import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useCurrentissuesNavData = () => {
  const apolloClient = useApolloClient()

  const { data } = useSuspenseQuery({
    queryKey: ['treeCurrentissues'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
          query TreeCurrentissuesQuery {
            allCurrentissues(orderBy: [SORT_ASC, TITLE_ASC]) {
              nodes {
                id
                label
              }
            }
          }
        `),
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data as NonNullable<typeof result.data>
    },
  })

  // subtract 1 for "fehlt hier was"
  const count = (data.allCurrentissues?.nodes?.length ?? 0) - 1

  const navData = {
    id: 'Aktuelle-Fehler',
    url: `/Daten/Aktuelle-Fehler`,
    label: `Aktuelle Fehler (${count})`,
    totalCount: data.allCurrentissues?.nodes.length,
    treeNodeType: 'table',
    treeMenuType: 'currentissues',
    treeId: 'currentissueFolder',
    treeTableId: null,
    treeUrl: ['Aktuelle-Fehler'],
    fetcherName: 'useCurrentissuesNavData',
    fetcherParams: {},
    hasChildren: !!count,
    component: NodeWithList,
    menus: data.allCurrentissues?.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'currentissue',
      treeId: p?.id,
      treeTableId: p?.id,
      treeUrl: ['Aktuelle-Fehler', p?.id],
      hasChildren: false,
    })),
  }

  return navData
}
