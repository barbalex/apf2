import { useEffect, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useEkAbrechnungstypWertesNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeEkAbrechnungstypWerte',
      store.tree.ekAbrechnungstypWerteGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeEkAbrechnungstypWertesQuery(
            $filter: EkAbrechnungstypWerteFilter!
          ) {
            allEkAbrechnungstypWertes(
              filter: $filter
              orderBy: [SORT_ASC, TEXT_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            totalCount: allEkAbrechnungstypWertes {
              totalCount
            }
          }
        `,
        variables: {
          filter: store.tree.ekAbrechnungstypWerteGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () =>
      reaction(() => store.tree.ekAbrechnungstypWerteGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const count = data?.data?.allEkAbrechnungstypWertes?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'EkAbrechnungstypWerte',
    listFilter: 'ekAbrechnungstypWerte',
    url: `/Daten/Werte-Listen/EkAbrechnungstypWerte`,
    label: `Teil-Population: EK-Abrechnungstypen (${isLoading ? '...' : `${count}/${totalCount}`})`,
    treeNodeType: 'folder',
    treeMenuType: 'ekAbrechnungstypWerteFolder',
    treeId: `EkAbrechnungstypWerteFolder`,
    treeUrl: ['Werte-Listen', 'EkAbrechnungstypWerte'],
    hasChildren: !!count,
    fetcherName: 'useEkAbrechnungstypWertesNavData',
    fetcherParams: {},
    component: NodeWithList,
    menus: (data?.data?.allEkAbrechnungstypWertes?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'ekAbrechnungstypWerte',
      treeId: p.id,
      treeUrl: ['Werte-Listen', 'EkAbrechnungstypWerte', p.id],
      hasChildren: false,
    })),
  }

  return { isLoading, error, navData }
}
