import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useCurrentissuesNavData = () => {
  const apolloClient = useApolloClient()

  const { data } = useQuery({
    queryKey: ['treeCurrentissues'],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeCurrentissuesQuery {
            allCurrentissues(orderBy: [SORT_ASC, TITLE_ASC]) {
              nodes {
                id
                label
              }
            }
          }
        `,
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  // subtract 1 for "fehlt hier was"
  const count = (data?.data?.allCurrentissues?.nodes?.length ?? 1) - 1

  const navData = {
    id: 'Aktuelle-Fehler',
    url: `/Daten/Aktuelle-Fehler`,
    label: `Aktuelle Fehler (${count})`,
    totalCount: data?.data?.allCurrentissues?.nodes?.length ?? 0,
    treeNodeType: 'table',
    treeMenuType: 'currentissues',
    treeId: 'currentissueFolder',
    treeUrl: ['Aktuelle-Fehler'],
    fetcherName: 'useCurrentissuesNavData',
    fetcherParams: {},
    hasChildren: !!count,
    component: NodeWithList,
    menus: (data?.data?.allCurrentissues?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'currentissue',
      treeId: p.id,
      treeUrl: ['Aktuelle-Fehler', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
