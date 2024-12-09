import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const useTpopfreiwkontrsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeTpopfreiwkontr', tpopId, store.tree.ekfGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopfreiwkontrsQuery(
            $ekfsFilter: TpopkontrFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopkontrsByTpopId(
                filter: $ekfsFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                totalCount
                nodes {
                  id
                  label: labelEkf
                }
              }
              totalCount: tpopkontrsByTpopId(
                filter: { typ: { equalTo: "Freiwilligen-Erfolgskontrolle" } }
              ) {
                totalCount
              }
            }
          }
        `,
        variables: {
          ekfsFilter: store.tree.ekfGqlFilterForTree,
          tpopId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.ekfGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.tpopById?.tpopkontrsByTpopId?.totalCount ?? 0
  const totalCount = data?.data?.tpopById?.totalCount?.totalCount ?? 0
  const menus = useMemo(
    () =>
      data?.data?.tpopById?.tpopkontrsByTpopId?.nodes?.map((p) => ({
        id: p.id,
        label: p.label,
      })) ?? [],
    [data?.data?.tpopById?.tpopkontrsByTpopId?.nodes],
  )

  const navData = useMemo(
    () => ({
      id: 'Freiwilligen-Kontrollen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Freiwilligen-Kontrollen`,
      label: `Freiwilligen-Kontrollen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      labelShort: `EKF (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus,
    }),
    [apId, count, isLoading, menus, popId, projId, totalCount, tpopId],
  )

  return { isLoading, error, navData }
}
