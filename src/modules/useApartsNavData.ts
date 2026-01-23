import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeApartGqlFilterForTreeAtom,
} from '../JotaiStore/index.ts'

export const useApartsNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const apartGqlFilterForTree = useAtomValue(treeApartGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeApart', projId, apId, apartGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeApartsQuery($apartsFilter: ApartFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              apartsByApId(filter: $apartsFilter, orderBy: LABEL_ASC) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: apartsByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          apartsFilter: apartGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.apById?.apartsByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'Taxa',
    listFilter: 'apart',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Taxa`,
    label: `Taxa (${count}/${totalCount})`,
    menus: (data?.data?.apById?.apartsByApId?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'apart',
      treeId: p.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'Taxa', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
