import { useMemo } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQuery } from '@tanstack/react-query'

import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useCurrentissuesNavData = () => {
  const apolloClient = useApolloClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeCurrentissues'],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeCurrentissuesQuery {
            allCurrentissues(orderBy: [SORT_ASC, TITLE_ASC]) {
              totalCount
              nodes {
                id
                label
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      }),
  })

  // subtract 1 for "fehlt hier was"
  const count = (data?.data?.allCurrentissues?.nodes?.length ?? 1) - 1

  const navData = useMemo(
    () => ({
      id: 'Aktuelle-Fehler',
      url: `/Daten/Aktuelle-Fehler`,
      label: `Aktuelle Fehler (${isLoading ? '...' : count})`,
      totalCount: data?.data?.allCurrentissues?.totalCount ?? 0,
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
    }),
    [
      count,
      data?.data?.allCurrentissues?.nodes,
      data?.data?.allCurrentissues?.totalCount,
      isLoading,
    ],
  )

  return { isLoading, error, navData }
}
