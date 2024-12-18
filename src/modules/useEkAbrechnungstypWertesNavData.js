import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'

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

  const navData = useMemo(
    () => ({
      id: 'EkAbrechnungstypWerte',
      url: `/Daten/Werte-Listen/EkAbrechnungstypWerte`,
      label: `Teil-Population: EK-Abrechnungstypen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus: (data?.data?.allEkAbrechnungstypWertes?.nodes ?? []).map((p) => ({
        id: p.id,
        label: p.label,
      })),
    }),
    [
      count,
      data?.data?.allEkAbrechnungstypWertes?.nodes,
      isLoading,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
