import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treePopberGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'

export const usePopbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  const popId = props?.popId ?? params.popId

  const popberGqlFilterForTree = useAtomValue(treePopberGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treePopber', popId, popberGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreePopbersQuery($popbersFilter: PopberFilter!, $popId: UUID!) {
            popById(id: $popId) {
              id
              popbersByPopId(filter: $popbersFilter, orderBy: LABEL_ASC) {
                nodes {
                  id
                  label
                }
              }
              totalCount: popbersByPopId {
                totalCount
              }
            }
          }
        `,
        variables: {
          popbersFilter: popberGqlFilterForTree,
          popId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.popById?.popbersByPopId?.nodes?.length ?? 0
  const totalCount = data?.data?.popById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Kontroll-Berichte',
    listFilter: 'popber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Kontroll-Berichte`,
    label: `Kontroll-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'popberFolder',
    treeId: `${popId}popberFolder`,
    treeParentTableId: popId,
    treeUrl: [
      'Projekte',
      projId,
      'Arten',
      apId,
      'Populationen',
      popId,
      'Kontroll-Berichte',
    ],
    hasChildren: !!count,
    menus: (data?.data?.popById?.popbersByPopId?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'popber',
      treeId: p.id,
      treeParentTableId: popId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
        p.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
