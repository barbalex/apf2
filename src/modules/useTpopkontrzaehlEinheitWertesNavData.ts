import { useEffect, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useTpopkontrzaehlEinheitWertesNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpopkontrzaehlEinheitWerte',
      store.tree.tpopkontrzaehlEinheitWerteGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopkontrzaehlEinheitWertesQuery(
            $filter: TpopkontrzaehlEinheitWerteFilter!
          ) {
            allTpopkontrzaehlEinheitWertes(
              filter: $filter
              orderBy: [SORT_ASC, TEXT_ASC]
            ) {
              nodes {
                id
                label
              }
            }
            totalCount: allTpopkontrzaehlEinheitWertes {
              totalCount
            }
          }
        `,
        variables: {
          filter: store.tree.tpopkontrzaehlEinheitWerteGqlFilterForTree,
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
        () => store.tree.tpopkontrzaehlEinheitWerteGqlFilterForTree,
        refetch,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const count = data?.data?.allTpopkontrzaehlEinheitWertes?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'TpopkontrzaehlEinheitWerte',
    listFilter: 'tpopkontrzaehlEinheitWerte',
    url: `/Daten/Werte-Listen/TpopkontrzaehlEinheitWerte`,
    label: `Teil-Population: Zähl-Einheiten (${isLoading ? '...' : `${count}/${totalCount}`})`,
    treeNodeType: 'folder',
    treeMenuType: 'TpopkontrzaehlEinheitWerte',
    treeId: `tpopkontrzaehlEinheitWerteFolder`,
    treeUrl: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte'],
    hasChildren: !!count,
    fetcherName: 'useTpopkontrzaehlEinheitWertesNavData',
    fetcherParams: {},
    component: NodeWithList,
    menus: (data?.data?.allTpopkontrzaehlEinheitWertes?.nodes ?? []).map(
      (p) => ({
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'tpopkontrzaehlEinheitWerte',
        treeId: p.id,
        treeUrl: ['Werte-Listen', 'TpopkontrzaehlEinheitWerte', p.id],
        hasChildren: false,
      }),
    ),
  }

  return { isLoading, error, navData }
}
