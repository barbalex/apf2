import { useMemo, useContext, useEffect } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { reaction } from 'mobx'

import { MobxContext } from '../mobxContext.js'

export const useZielNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const jahr = props?.jahr ?? params.jahr
  const zielId = props?.zielId ?? params.zielId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeZiel', zielId, store.tree.zielberGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query NavZielQuery($zielId: UUID!, $zielberFilter: ZielberFilter!) {
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

  const zielbersCount = data?.data?.zielById?.zielbersByZielId?.totalCount ?? 0
  const filteredZielbersCount =
    data?.data?.zielById?.filteredZielbers?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: zielId,
      url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}/${zielId}`,
      label: data?.data?.zielById?.label ?? '(nicht beschrieben)',
      // leave totalCount undefined as the menus are folders
      menus: [
        {
          id: 'Ziel',
          label: 'Ziel',
        },
        {
          id: 'Berichte',
          label: `Berichte (${isLoading ? '...' : `${filteredZielbersCount}/${zielbersCount}`})`,
          treeNodeType: 'folder',
          treeMenuType: 'zielberFolder',
          treeId: `${zielId}ZielberFolder`,
          treeTableId: zielId,
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
          fetcherName: 'useZielbersNavData',
          fetcherParams: { projId, apId, jahr, zielId },
          hasChildren: !!filteredZielbersCount,
        },
      ],
    }),
    [
      apId,
      data?.data?.zielById?.label,
      filteredZielbersCount,
      isLoading,
      jahr,
      projId,
      zielId,
      zielbersCount,
    ],
  )

  return { isLoading, error, navData }
}
