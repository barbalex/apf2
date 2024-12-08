import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const useTpopsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeTpops', popId, store.tree.tpopGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopsQuery($tpopsFilter: TpopFilter!, $popId: UUID!) {
            popById(id: $popId) {
              id
              tpopsByPopId(
                filter: $tpopsFilter
                orderBy: [NR_ASC, FLURNAME_ASC]
              ) {
                totalCount
                nodes {
                  id
                  label
                  status
                }
              }
              totalCount: tpopsByPopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopsFilter: store.tree.tpopGqlFilterForTree,
          popId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.tpopGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.popById?.tpopsByPopId?.nodes?.length ?? 0
  const totalCount = data?.data?.popById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Teil-Populationen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen`,
      label: `Teil-Populationen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus:
        data?.data?.popById?.tpopsByPopId?.nodes?.map((p) => ({
          id: p.id,
          label: p.label,
          status: p.status,
        })) ?? [],
    }),
    [
      apId,
      count,
      data?.data?.popById?.tpopsByPopId?.nodes,
      isLoading,
      popId,
      projId,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
