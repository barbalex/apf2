import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { StoreContext } from '../storeContext.js'

export const useApsNavData = (props) => {
  const apolloClient = useApolloClient()
  const { projId: projIdFromParams } = useParams()
  const projId = props?.projId ?? projIdFromParams

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeAp', projId, store.tree.apGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeApsQuery($apsFilter: ApFilter!, $projId: UUID!) {
            allAps(filter: $apsFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
            totalCount: allAps(filter: { projId: { equalTo: $projId } }) {
              totalCount
            }
          }
        `,
        variables: {
          apsFilter: store.tree.apGqlFilterForTree,
          projId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.apGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const navData = useMemo(
    () => ({
      id: 'Daten',
      url: `/Daten/Projekte/${projId}/Arten`,
      label: `Arten`,
      totalCount: data?.data?.totalCount?.totalCount ?? 0,
      menus:
        data?.data?.allAps?.nodes.map((p) => ({
          id: p.id,
          label: p.label,
        })) ?? [],
    }),
    [data?.data?.allAps?.nodes, data?.data?.totalCount?.totalCount, projId],
  )

  return { isLoading, error, navData }
}
