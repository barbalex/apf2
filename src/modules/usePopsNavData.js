import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const usePopsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treePop', projId, apId, store.tree.popGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreePopsQuery($popsFilter: PopFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              popsByApId(filter: $popsFilter, orderBy: [NR_ASC, NAME_ASC]) {
                totalCount
                nodes {
                  id
                  label
                  status
                }
              }
              totalCount: popsByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          popsFilter: store.tree.popGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.popGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.apById?.popsByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Populationen',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen`,
      label: `Populationen (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus:
        data?.data?.apById?.popsByApId?.nodes?.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [
      apId,
      count,
      data?.data?.apById?.popsByApId?.nodes,
      isLoading,
      projId,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
