import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { StoreContext } from '../storeContext.js'

export const useAdressesNavData = () => {
  const apolloClient = useApolloClient()

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeAdresses', store.tree.adresseGqlFilterForTree],
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

  const navData = useMemo(
    () => ({
      id: 'Benutzer',
      url: `/Daten/Benutzer`,
      label: `Benutzer`,
      totalCount: data?.data?.totalCount?.totalCount ?? 0,
      menus:
        data?.data?.allAdresses?.nodes.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [data?.data?.allAdresses?.nodes, data?.data?.totalCount?.totalCount],
  )

  return { isLoading, error, navData }
}
