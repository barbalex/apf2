import { useMemo, useEffect, useContext, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'
import { PopMapIcon } from '../components/Projekte/TreeContainer/Tree/Row.jsx'

export const useApsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const showPopIcon = store.activeApfloraLayers?.includes('pop')
  const [, setRerenderer] = useState(0)
  const rerender = useCallback(() => setRerenderer((prev) => prev + 1), [])

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
  useEffect(
    () => reaction(() => store.activeApfloraLayers.slice(), rerender),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.allAps?.nodes?.length ?? 0
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Arten',
      url: `/Daten/Projekte/${projId}/Arten`,
      label: `Arten (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus: (data?.data?.allAps?.nodes ?? [])?.map((p) => {
        const showThisPopIcon = showPopIcon && p.id === apId

        return {
          id: p.id,
          label: p.label,
          labelLeftElement: showThisPopIcon ? PopMapIcon : undefined,
        }
      }),
    }),
    [
      apId,
      count,
      data?.data?.allAps?.nodes,
      isLoading,
      projId,
      showPopIcon,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
