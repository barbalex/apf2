import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'

export const useZielsOfJahrNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const jahr = props?.jahr ?? params.jahr

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeZielsOfJahr', apId, jahr, store.tree.zielGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeZielsOfJahrQuery(
            $zielsFilter: ZielFilter!
            $jahrFilter: ZielFilter!
            $apId: UUID!
          ) {
            apById(id: $apId) {
              id
              zielsByApId(filter: $jahrFilter) {
                totalCount
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
          jahrFilter: {
            jahr: { equalTo: +jahr },
          },
          zielsFilter: {
            ...store.tree.zielGqlFilterForTree,
            jahr: { equalTo: +jahr },
          },
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

  const count = data?.data?.apById?.zielsByApId?.totalCount ?? 0
  const filteredZiels = useMemo(
    () => data?.data?.apById?.filteredZiels?.nodes ?? [],
    [data?.data?.apById?.filteredZiels?.nodes],
  )
  const menus = useMemo(
    () =>
      filteredZiels.map((p) => ({
        id: p.id,
        label: p.label,
        jahr: p.jahr,
      })),
    [filteredZiels],
  )

  const navData = useMemo(
    () => ({
      id: jahr,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}`,
      label: `Ziele für ${jahr} (${isLoading ? '...' : `${filteredZiels.length}/${count}`})`,
      labelShort: `${jahr} (${isLoading ? '...' : `${filteredZiels.length}/${count}`})`,
      menus,
    }),
    [apId, count, filteredZiels.length, isLoading, jahr, menus, projId],
  )

  return { isLoading, error, navData }
}
