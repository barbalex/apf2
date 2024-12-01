import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'
import union from 'lodash/union'

import { StoreContext } from '../storeContext.js'

export const useZieljahrsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(StoreContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeZieljahrs', apId, store.tree.zielGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeZieljahrsQuery($zielsFilter: ZielFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              zielsByApId(orderBy: [JAHR_ASC, LABEL_ASC]) {
                nodes {
                  id
                  label
                  jahr
                }
              }
              filteredZiels: zielsByApId(
                filter: $zielsFilter
                orderBy: [JAHR_ASC, LABEL_ASC]
              ) {
                nodes {
                  id
                  label
                  jahr
                }
              }
            }
          }
        `,
        variables: {
          zielsFilter: store.tree.zielGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.zielGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const ziels = useMemo(
    () => data?.data?.apById?.zielsByApId?.nodes ?? [],
    [data?.data?.apById?.zielsByApId?.nodes],
  )
  const filteredZiels = useMemo(
    () => data?.data?.apById?.filteredZiels?.nodes ?? [],
    [data?.data?.apById?.filteredZiels?.nodes],
  )
  const menus = useMemo(
    () =>
      ziels
        // reduce to distinct years
        .reduce((a, el) => union(a, [el.jahr]), [])
        .sort((a, b) => a - b)
        .map((z) => ({
          id: z,
          label: z,
        })),
    [ziels],
  )
  const filteredMenus = useMemo(
    () =>
      filteredZiels
        // reduce to distinct years
        .reduce((a, el) => union(a, [el.jahr]), [])
        .sort((a, b) => a - b)
        .map((z) => ({
          id: z,
          label: z,
        })),
    [filteredZiels],
  )

  const navData = useMemo(
    () => ({
      id: 'AP-Ziele',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele`,
      label: `AP-Ziele Jahre (${isLoading ? '...' : `${filteredMenus.length}/${menus.length}`})`,
      menus: filteredMenus,
    }),
    [apId, filteredMenus, isLoading, menus.length, projId],
  )

  return { isLoading, error, navData }
}
