import { useEffect, useContext } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { reaction } from 'mobx'
import { useParams } from 'react-router'

import { MobxContext } from '../mobxContext.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const usePopmassnbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const store = useContext(MobxContext)

  const { data, refetch } = useQuery({
    queryKey: [
      'treePopmassnber',
      popId,
      store.tree.popmassnberGqlFilterForTree,
    ],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreePopmassnbersQuery(
            $popmassnbersFilter: PopmassnberFilter!
            $popId: UUID!
          ) {
            popById(id: $popId) {
              id
              popmassnbersByPopId(
                filter: $popmassnbersFilter
                orderBy: LABEL_ASC
              ) {
                nodes {
                  id
                  label
                }
              }
              totalCount: popmassnbersByPopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          popmassnbersFilter: store.tree.popmassnberGqlFilterForTree,
          popId,
        },
        fetchPolicy: 'no-cache',
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })
  // this is how to make the filter reactive in a hook
  // see: https://stackoverflow.com/a/72229014/712005
  // react to filter changes without observer (https://stackoverflow.com/a/72229014/712005)
  useEffect(
    () => reaction(() => store.tree.popmassnberGqlFilterForTree, refetch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  const count = data?.data?.popById?.popmassnbersByPopId?.nodes?.length ?? 0
  const totalCount = data?.data?.popById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Massnahmen-Berichte',
    listFilter: 'popmassnber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Massnahmen-Berichte`,
    label: `Massnahmen-Berichte (${count}/${totalCount})`,
    labelShort: `Massn.-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'popmassnberFolder',
    treeId: `${popId}PopmassnberFolder`,
    treeParentTableId: popId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Massnahmen-Berichte',
    ],
    hasChildren: count > 0,
    component: NodeWithList,
    menus: (data?.data?.popById?.popmassnbersByPopId?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'popmassnber',
      treeId: p.id,
      treeParentTableId: popId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Massnahmen-Berichte',
        p.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
