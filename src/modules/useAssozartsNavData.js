import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'
import { has } from 'lodash'

export const useAssozartsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [
      'treeAssozart',
      projId,
      apId,
      store.tree.assozartGqlFilterForTree,
    ],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeAssozartsQuery(
            $assozartsFilter: AssozartFilter!
            $apId: UUID!
          ) {
            apById(id: $apId) {
              id
              assozartsByApId(filter: $assozartsFilter, orderBy: LABEL_ASC) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: assozartsByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          assozartsFilter: store.tree.assozartGqlFilterForTree,
          apId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.assozartGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.apById?.assozartsByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'assoziierte-Arten',
      listFilter: 'assozart',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/assoziierte-Arten`,
      label: `Assoziierte Arten (${isLoading ? '...' : `${count}/${totalCount}`})`,
      menus: (data?.data?.apById?.assozartsByApId?.nodes ?? []).map((p) => ({
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'assozart',
        treeId: p.id,
        treeParentId: apId,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'assoziierte-Arten', p.id],
        hasChildren: false,
      })),
    }),
    [
      apId,
      count,
      data?.data?.apById?.assozartsByApId?.nodes,
      isLoading,
      projId,
      totalCount,
    ],
  )

  return { isLoading, error, navData }
}
