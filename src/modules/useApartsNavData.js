import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const useApartsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeApart', projId, apId, store.tree.apartGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeApartsQuery($apartsFilter: ApartFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              apartsByApId(filter: $apartsFilter, orderBy: LABEL_ASC) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: apartsByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          apartsFilter: store.tree.apartGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.apartGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.apById?.apartsByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Taxa',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Taxa`,
      label: `Taxa (${isLoading ? '...' : `${count}/${totalCount}`})`,
      isFilterable: true,
      menus: (data?.data?.apById?.apartsByApId?.nodes ?? []).map((p) => ({
        id: p.id,
        label: p.label,
      })),
    }),
    [
      apId,
      count,
      data?.data?.apById?.apartsByApId?.nodes,
      isLoading,
      projId,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
