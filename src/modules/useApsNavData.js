import { useMemo, useEffect, useState } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { autorun } from 'mobx'
import { useParams } from 'react-router'

export const useApsNavData = ({
  apGqlFilterForTree,
  projId: projIdPassedIn,
}) => {
  const apolloClient = useApolloClient()
  const { projId: projIdFromParams } = useParams()
  const projId = projIdPassedIn ?? projIdFromParams

  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  const [filter, setFilter] = useState(apGqlFilterForTree)
  useEffect(() => {
    const disposer = autorun(() => {
      setFilter(apGqlFilterForTree)
    })
    return () => disposer()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeAp', projId, apGqlFilterForTree],
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
          apsFilter: filter,
          projId,
        },
        fetchPolicy: 'no-cache',
      }),
  })

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
