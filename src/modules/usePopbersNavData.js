import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const usePopbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treePopbers', popId, store.tree.popberGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreePopbersQuery($popbersFilter: PopberFilter!, $popId: UUID!) {
            popById(id: $popId) {
              id
              popbersByPopId(filter: $popbersFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                }
              }
              totalCount: popbersByPopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          popbersFilter: store.tree.popberGqlFilterForTree,
          popId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.popberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.popById?.popbersByPopId?.nodes?.length ?? 0
  const totalCount = data?.data?.popById?.totalCount?.totalCount ?? 0
  const menus = useMemo(
    () =>
      data?.data?.popById?.popbersByPopId?.nodes?.map((p) => ({
        id: p.id,
        label: p.label,
      })) ?? [],
    [data?.data?.popById?.popbersByPopId?.nodes],
  )

  const navData = useMemo(
    () => ({
      id: 'Kontroll-Berichte',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Kontroll-Berichte`,
      label: `Kontroll-Berichte (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus,
    }),
    [apId, count, isLoading, menus, popId, projId, totalCount],
  )

  return { isLoading, error, navData }
}
