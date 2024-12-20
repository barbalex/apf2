import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const useEkfrequenzsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeEkfrequenz', apId, store.tree.ekfrequenzGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeEkfrequenzsQuery(
            $ekfrequenzsFilter: EkfrequenzFilter!
            $apId: UUID!
          ) {
            apById(id: $apId) {
              id
              ekfrequenzsByApId(filter: $ekfrequenzsFilter, orderBy: SORT_ASC) {
                nodes {
                  id
                  label: code
                }
              }
              totalCount: ekfrequenzsByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          ekfrequenzsFilter: store.tree.ekfrequenzGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.ekfrequenzGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0
  const menus = useMemo(
    () =>
      (data?.data?.apById?.ekfrequenzsByApId?.nodes ?? []).map((p) => ({
        id: p.id,
        label: p.label ?? '(kein Kürzel)',
      })),
    [data?.data?.apById?.ekfrequenzsByApId?.nodes],
  )

  const navData = useMemo(
    () => ({
      id: 'EK-Frequenzen',
      listFilter: 'ekfrequenz',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/EK-Frequenzen`,
      label: `EK-Frequenzen (${isLoading ? '...' : `${menus.length}/${totalCount}`})`,
      menus,
    }),
    [apId, isLoading, menus, projId, totalCount],
  )

  return { isLoading, error, navData }
}
