import { useMemo, useEffect, useContext, useState, useCallback } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'
import { PopMapIconComponent } from '../components/Projekte/TreeContainer/Tree/Row.jsx'
import { TpopMapIconComponent } from '../components/Projekte/TreeContainer/Tree/Row.jsx'
import { BeobNichtBeurteiltMapIconComponent } from '../components/Projekte/TreeContainer/Tree/Row.jsx'
import { BeobNichtZuzuordnenMapIconComponent } from '../components/Projekte/TreeContainer/Tree/Row.jsx'
import { BeobZugeordnetMapIconComponent } from '../components/Projekte/TreeContainer/Tree/Row.jsx'

export const useApsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const showPopIcon = store.activeApfloraLayers?.includes('pop')
  const showTpopIcon = store.activeApfloraLayers?.includes('tpop')
  const showBeobnichtbeurteiltIcon =
    store.activeApfloraLayers?.includes('beobNichtBeurteilt')
  const showBeobnichtzuzuordnenIcon = store.activeApfloraLayers?.includes(
    'beobNichtZuzuordnen',
  )
  const showBeobzugeordnetIcon =
    store.activeApfloraLayers?.includes('beobZugeordnet')
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
        const showThisTpopIcon = showTpopIcon && p.id === apId
        const showThisBeobnichtbeurteiltIcon =
          showBeobnichtbeurteiltIcon && p.id === apId
        const showThisBeobnichtzuzuordnenIcon =
          showBeobnichtzuzuordnenIcon && p.id === apId
        const showThisBeobzugeordnetIcon =
          showBeobzugeordnetIcon && p.id === apId
        const labelLeftElements = []
        if (showThisPopIcon) labelLeftElements.push(PopMapIconComponent)
        if (showThisTpopIcon) labelLeftElements.push(TpopMapIconComponent)
        if (showThisBeobnichtbeurteiltIcon)
          labelLeftElements.push(BeobNichtBeurteiltMapIconComponent)
        if (showThisBeobnichtzuzuordnenIcon)
          labelLeftElements.push(BeobNichtZuzuordnenMapIconComponent)
        if (showThisBeobzugeordnetIcon)
          labelLeftElements.push(BeobZugeordnetMapIconComponent)

        return {
          id: p.id,
          label: p.label,
          labelLeftElements,
        }
      }),
    }),
    [
      apId,
      count,
      data?.data?.allAps?.nodes,
      isLoading,
      projId,
      showBeobnichtbeurteiltIcon,
      showBeobnichtzuzuordnenIcon,
      showBeobzugeordnetIcon,
      showPopIcon,
      showTpopIcon,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
