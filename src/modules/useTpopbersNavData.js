import { useMemo, useEffect, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.js'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.jsx'

export const useTpopbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId
  const tpopId = props?.tpopId ?? params.tpopId

  const store = useContext(MobxContext)

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['treeTpopber', tpopId, store.tree.tpopberGqlFilterForTree],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeTpopbersQuery(
            $tpopbersFilter: TpopberFilter!
            $tpopId: UUID!
          ) {
            tpopById(id: $tpopId) {
              id
              tpopbersByTpopId(filter: $tpopbersFilter, orderBy: LABEL_ASC) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: tpopbersByTpopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          tpopbersFilter: store.tree.tpopberGqlFilterForTree,
          tpopId,
        },
        fetchPolicy: 'no-cache',
      }),
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.tpopberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.tpopById?.tpopbersByTpopId?.totalCount ?? 0
  const totalCount = data?.data?.tpopById?.totalCount?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Kontroll-Berichte',
      listFilter: 'tpopber',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Teil-Populationen/${tpopId}/Kontroll-Berichte`,
      label: `Kontroll-Berichte (${isLoading ? '...' : `${count}/${totalCount}`})`,
      treeNodeType: 'folder',
      menuType: 'tpopberFolder',
      treeId: `${tpopId}TpopberFolder`,
      treeParentTableId: tpopId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Teil-Populationen',
        tpopId,
        'Kontroll-Berichte',
      ],
      hasChildren: count > 0,
      component: NodeWithList,
      menus: (data?.data?.tpopById?.tpopbersByTpopId?.nodes ?? []).map((p) => ({
        id: p.id,
        label: p.label,
        treeNodeType: 'table',
        treeMenuType: 'tpopber',
        treeId: p.id,
        treeParentTableId: tpopId,
        treeUrl: [
          'Projekte',
          projId,
          'Arten',
          apId,
          'Populationen',
          popId,
          'Teil-Populationen',
          tpopId,
          'Kontroll-Berichte',
          p.id,
        ],
        hasChildren: false,
      })),
    }),
    [
      apId,
      count,
      data?.data?.tpopById?.tpopbersByTpopId?.nodes,
      isLoading,
      popId,
      projId,
      totalCount,
      tpopId,
    ],
  )

  return { isLoading, error, navData }
}
