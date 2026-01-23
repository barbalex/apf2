import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import {
  store as jotaiStore,
  treeApberGqlFilterForTreeAtom,
} from '../store/index.ts'

export const useApbersNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const apberGqlFilterForTree = useAtomValue(treeApberGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeApber', projId, apId, apberGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeApbersQuery($apbersFilter: ApberFilter!, $apId: UUID!) {
            apById(id: $apId) {
              id
              apbersByApId(filter: $apbersFilter, orderBy: LABEL_ASC) {
                totalCount
                nodes {
                  id
                  label
                }
              }
              totalCount: apbersByApId {
                totalCount
              }
            }
          }
        `,
        variables: {
          apbersFilter: apberGqlFilterForTree,
          apId,
        },
      })
      if (result.error) throw result.error
      return result
    },
    suspense: true,
  })

  const count = data?.data?.apById?.apbersByApId?.nodes?.length ?? 0
  const totalCount = data?.data?.apById?.totalCount?.totalCount ?? 0

  const navData = {
    id: 'AP-Berichte',
    listFilter: 'apber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Berichte`,
    label: `AP-Berichte (${count}/${totalCount})`,
    menus: (data?.data?.apById?.apbersByApId?.nodes ?? []).map((p) => ({
      id: p.id,
      label: p.label,
      treeNodeType: 'table',
      treeMenuType: 'apber',
      treeId: p.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Berichte', p.id],
      hasChildren: false,
    })),
  }

  return navData
}
