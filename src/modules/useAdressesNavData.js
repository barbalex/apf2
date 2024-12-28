import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useAdressesNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeAdresse', store.tree.adresseGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeAdressesQuery($adressesFilter: AdresseFilter!) {
            allAdresses(filter: $adressesFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            totalCount: allAdresses {
              totalCount
            }
          }
        `,
        variables: {
          adressesFilter: store.tree.adresseGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.adresseGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const count = data?.data?.allAdresses?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Adressen',
      listFilter: 'adresse',
      url: `/Daten/Werte-Listen/Adressen`,
      label: `Adressen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      treeNodeType: 'folder',
      treeMenuType: 'adresseFolder',
      treeId: `AdresseFolder`,
      treeUrl: ['Werte-Listen', 'Adressen'],
      hasChildren: !!count,
      fetcherName: 'useAdressesNavData',
      fetcherParams: {},
      component: NodeWithList,
      menus: (data?.data?.allAdresses?.nodes ?? []).map((p) => ({
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'adresse',
        treeId: p.id,
        treeUrl: ['Werte-Listen', 'Adressen', p.id],
        hasChildren: false,
      })),
    }),
    [count, data?.data?.allAdresses?.nodes, isLoading, totalCount],
  )

  return { isLoading, error, navData }
}
