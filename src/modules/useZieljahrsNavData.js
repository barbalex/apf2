import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'
import countBy from 'lodash/countBy'

import { MobxContext } from '../mobxContext.js'
import { has } from 'lodash'

export const useZieljahrsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeZieljahrs', apId, store.tree.zielGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeZieljahrsQuery($zielsFilter: ZielFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              zielsByApId {
                nodes {
                  id
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
  const zieljahrsCount = useMemo(() => {
    const jahrs = countBy(ziels, 'jahr')
    const count = Object.keys(jahrs).length
    return count
  }, [ziels])

  const menus = useMemo(() => {
    const countByJahr = countBy(filteredZiels, 'jahr')
    const unfilteredCountByJahr = countBy(ziels, 'jahr')
    // convert into array of objects with id=jahr and count
    const jahre = Object.keys(countByJahr).map((jahr) => ({
      id: +jahr,
      label: `${jahr} (${countByJahr[jahr]}/${unfilteredCountByJahr[jahr]})`,
      jahr: +jahr,
      treeNodeType: 'folder',
      treeMenuType: 'zieljahrFolder',
      treeId: `${apId}ZielJahreFolder`,
      treeTableId: apId,
      treeTableParentId: apId,
      treeParentId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', +jahr],
      fetcherName: 'useZielsOfJahrNavData',
      fetcherParams: { projId, apId, jahr: +jahr },
      hasChildren: !!countByJahr[jahr],
    }))

    return jahre
  }, [apId, filteredZiels, projId, ziels])

  const navData = useMemo(
    () => ({
      id: 'AP-Ziele',
      label: `AP-Ziele Jahre (${isLoading ? '...' : `${menus.length}/${zieljahrsCount}`})`,
      listFilter: 'ziel',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele`,
      treeNodeType: 'folder',
      treeMenuType: 'zieljahrsFolder',
      treeId: `${apId}ZieljahrsFolder`,
      treeTableId: apId,
      treeParentId: apId,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele'],
      hasChildren: !!zieljahrsCount,
      fetcherName: 'useZieljahrsNavData',
      fetcherParams: { projId, apId },
      menus,
    }),
    [apId, menus, isLoading, projId, zieljahrsCount],
  )

  return { isLoading, error, navData }
}
