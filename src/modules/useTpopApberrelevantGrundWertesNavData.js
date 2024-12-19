import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'

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
      url: `/Daten/Werte-Listen/ApberrelevantGrundWerte`,
      label: `Teil-Population: Grund für AP-Bericht Relevanz (${isLoading ? '...' : `${count}/${totalCount}`})`,
      isFilterable: true,
      menus: (data?.data?.allTpopApberrelevantGrundWertes?.nodes ?? []).map(
        (p) => ({
          id: p.id,
          label: p.label,
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
