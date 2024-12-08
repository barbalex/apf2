import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../storeContext.js'

export const useTpopfeldkontrsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeTpopfeldkontrs', tpopId, store.tree.ekGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopfeldkontrsQuery(
            $eksFilter: TpopkontrFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopkontrsByTpopId(
                filter: $eksFilter
                orderBy: [JAHR_ASC, DATUM_ASC]
              ) {
                totalCount
                nodes {
                  id
                  label: labelEk
                }
              }
              totalCount: tpopkontrsByTpopId(
                filter: {
                  typ: { distinctFrom: "Freiwilligen-Erfolgskontrolle" }
                }
              ) {
                totalCount
              }
            }
          }
        `,
        variables: {
          eksFilter: store.tree.ekGqlFilterForTree,
          tpopId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.ekGqlFilterForTree, refetch),
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
      id: 'Feld-Kontrollen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Feld-Kontrollen`,
      label: `Feld-Kontrollen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      labelShort: `EK (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus,
    }),
    [apId, count, isLoading, menus, popId, projId, totalCount, tpopId],
  )

  return { isLoading, error, navData }
}
