import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'

export const useZielbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  let jahr = props?.jahr ?? params.jahr
  jahr = jahr ? +jahr : jahr
  const zielId = props?.zielId ?? params.zielId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeZielber', zielId, store.tree.zielberGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavZielbersQuery(
            $zielId: UUID!
            $zielberFilter: ZielberFilter!
          ) {
            zielById(id: $zielId) {
              id
              label
              zielbersByZielId {
                totalCount
              }
              filteredZielbers: zielbersByZielId(
                filter: $zielberFilter
                orderBy: LABEL_ASC
              ) {
                totalCount
                nodes {
                  id
                  label
                }
              }
            }
          }
        `,
        variables: {
          zielId,
          zielberFilter: store.tree.zielberGqlFilterForTree,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  useEffect(
    () => reaction(() => store.tree.zielberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.zielById?.zielbersByZielId?.totalCount ?? 0
  const filteredCount = data?.data?.zielById?.filteredZielbers?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Berichte',
      listFilter: 'zielber',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}/${zielId}/Berichte`,
      label: `Zielberichte (${isLoading ? '...' : `${filteredCount}/${count}`})`,
      treeNodeType: 'folder',
      treeMenuType: 'zielberFolder',
      treeId: zielId,
      treeParentId: jahr,
      treeParentTableId: apId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'AP-Ziele',
        jahr,
        zielId,
        'Berichte',
      ],
      hasChildren: !!count,
      fetcherName: 'useZielsOfJahrNavData',
      fetcherParams: { projId, apId, jahr },
      passTransitionStateToChildren: true,
      alwaysOpen: true,
      menus: (data?.data?.zielById?.filteredZielbers?.nodes ?? []).map(
        (zielber) => ({
          id: zielber.id,
          label: zielber.label,
          treeNodeType: 'table',
          treeMenuType: 'zielber',
          treeId: zielber.id,
          treeParentId: zielId,
          treeParentTableId: zielId,
          treeUrl: [
            'Projekte',
            projId,
            'Arten',
            apId,
            'AP-Ziele',
            jahr,
            zielId,
            'Berichte',
            zielber.id,
          ],
          hasChildren: false,
        }),
      ),
    }),
    [
      apId,
      count,
      data?.data?.zielById?.filteredZielbers?.nodes,
      filteredCount,
      isLoading,
      jahr,
      projId,
      zielId,
    ],
  )

  return { isLoading, error, navData }
}
