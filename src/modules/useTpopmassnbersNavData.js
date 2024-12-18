import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const useTpopmassnbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpopmassnber',
      tpopId,
      store.tree.tpopmassnberGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopmassnbersQuery(
            $tpopmassnbersFilter: TpopmassnberFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopmassnbersByTpopId(
                filter: $tpopmassnbersFilter
                orderBy: LABEL_ASC
              ) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: tpopmassnbersByTpopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopmassnbersFilter: store.tree.tpopmassnberGqlFilterForTree,
          tpopId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.tpopmassnberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.tpopById?.tpopmassnbersByTpopId?.totalCount ?? 0
  const totalCount = data?.data?.tpopById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Massnahmen-Berichte',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Massnahmen-Berichte`,
      label: `Massnahmen-Berichte (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus: (data?.data?.tpopById?.tpopmassnbersByTpopId?.nodes ?? []).map(
        (p) => ({
          id: p.id,
          label: p.label,
        }),
      ),
    }),
    [
      apId,
      count,
      data?.data?.tpopById?.tpopmassnbersByTpopId?.nodes,
      isLoading,
      popId,
      projId,
      totalCount,
      tpopId,
    ],
  )

  return { isLoading, error, navData }
}
