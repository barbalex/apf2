import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treePopmassnberGqlFilterForTreeAtom,
} from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const usePopmassnbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const popmassnberGqlFilterForTree = useAtomValue(
    treePopmassnberGqlFilterForTreeAtom,
  )

  const { data } = useQuery({
    queryKey: ['treePopmassnber', popId, popmassnberGqlFilterForTree],
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
          popmassnbersFilter: popmassnberGqlFilterForTree,
          popId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

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
