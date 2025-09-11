import { useMemo, useEffect, useContext } from 'react'
import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useTpopApberrelevantGrundWertesNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpopApberrelevantGrundWerte',
      store.tree.tpopApberrelevantGrundWerteGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopApberrelevantGrundWerteQuery(
            $tpopApberrelevantGrundWertsFilter: TpopApberrelevantGrundWerteFilter!
          ) {
            allTpopApberrelevantGrundWertes(
              filter: $tpopApberrelevantGrundWertsFilter
              orderBy: [SORT_ASC, TEXT_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            totalCount: allTpopApberrelevantGrundWertes {
              totalCount
            }
          }
        `,
        variables: {
          tpopApberrelevantGrundWertsFilter:
            store.tree.tpopApberrelevantGrundWerteGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () =>
      reaction(
        () => store.tree.tpopApberrelevantGrundWerteGqlFilterForTree,
        refetch,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const count = data?.data?.allTpopApberrelevantGrundWertes?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'ApberrelevantGrundWerte',
      listFilter: 'tpopApberrelevantGrundWerte',
      url: `/Daten/Werte-Listen/ApberrelevantGrundWerte`,
      label: `Teil-Population: Grund für AP-Bericht Relevanz (${isLoading ? '...' : `${count}/${totalCount}`})`,
      treeNodeType: 'folder',
      treeMenuType: 'tpopApberrelevantGrundWerteFolder',
      treeId: `tpopApberrelevantGrundWerteFolder`,
      treeUrl: ['Werte-Listen', 'ApberrelevantGrundWerte'],
      hasChildren: !!count,
      fetcherName: 'useTpopApberrelevantGrundWertesNavData',
      fetcherParams: {},
      component: NodeWithList,
      menus: (data?.data?.allTpopApberrelevantGrundWertes?.nodes ?? []).map(
        (p) => ({
          id: p.id,
          label: p.label,
          treeNodeType: 'table',
          treeMenuType: 'tpopApberrelevantGrundWerte',
          treeId: p.id,
          treeUrl: ['Werte-Listen', 'ApberrelevantGrundWerte', p.id],
          hasChildren: false,
        }),
      ),
    }),
    [
      count,
      data?.data?.allTpopApberrelevantGrundWertes?.nodes,
      isLoading,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
