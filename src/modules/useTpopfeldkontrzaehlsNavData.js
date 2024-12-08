import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../storeContext.js'

export const useTpopfeldkontrzaehlsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId
  const tpopkontrId = props?.tpopkontrId ?? params.tpopkontrId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeTpopfeldkontrzaehls',
      tpopId,
      store.tree.tpopkontrzaehlGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopfeldkontrzaehlsQuery(
            $tpopkontrzaehlsFilter: TpopkontrzaehlFilter!
            $tpopkontrId: UUID!
          ) {
            tpopkontrById(id: $tpopkontrId) {
              id
              tpopkontrzaehlsByTpopkontrId(
                filter: $tpopkontrzaehlsFilter
                orderBy: LABEL_ASC
              ) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: tpopkontrzaehlsByTpopkontrId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopkontrzaehlsFilter: store.tree.tpopkontrzaehlGqlFilterForTree,
          tpopkontrId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.tpopkontrzaehlGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count =
    data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.totalCount ?? 0
  const totalCount = data?.data?.tpopkontrById?.totalCount?.totalCount ?? 0
  const menus = useMemo(
    () =>
      data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes?.map(
        (p) => ({
          id: p.id,
          label: p.label,
        }),
      ) ?? [],
    [data?.data?.tpopkontrById?.tpopkontrzaehlsByTpopkontrId?.nodes],
  )

  const navData = useMemo(
    () => ({
      id: 'Zaehlungen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen/${tpopkontrId}/Zaehlungen`,
      label: `Zählungen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus,
    }),
    [
      apId,
      count,
      isLoading,
      menus,
      popId,
      projId,
      totalCount,
      tpopId,
      tpopkontrId,
    ],
  )

  return { isLoading, error, navData }
}
