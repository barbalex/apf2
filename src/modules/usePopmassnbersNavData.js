import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const usePopmassnbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treePopmassnber',
      popId,
      store.tree.popmassnberGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreePopmassnbersQuery(
            $popmassnbersFilter: PopmassnberFilter!
            $popId: UUID!
          ) {
            popById(id: $popId) {
              id
              popmassnbersByPopId(
                filter: $popmassnbersFilter
                orderBy: LABEL_ASC
              ) {
                nodes {
                  id
                  label
                }
              }
              totalCount: popmassnbersByPopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          popmassnbersFilter: store.tree.popmassnberGqlFilterForTree,
          popId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.popmassnberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.popById?.popmassnbersByPopId?.nodes?.length ?? 0
  const totalCount = data?.data?.popById?.totalCount?.totalCount ?? 0
  const menus = useMemo(
    () =>
      data?.data?.popById?.popmassnbersByPopId?.nodes?.map((p) => ({
        id: p.id,
        label: p.label,
      })) ?? [],
    [data?.data?.popById?.popmassnbersByPopId?.nodes],
  )

  const navData = useMemo(
    () => ({
      id: 'Massnahmen-Berichte',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Massnahmen-Berichte`,
      label: `Massnahmen-Berichte (${isLoading ? '...' : `${count}/${totalCount}`})`,
      labelShort: `Massn.-Berichte (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus,
    }),
    [apId, count, isLoading, menus, popId, projId, totalCount],
  )

  return { isLoading, error, navData }
}
