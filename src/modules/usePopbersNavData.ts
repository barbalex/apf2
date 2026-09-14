import { graphql } from '../gql'
import { useApolloClient } from '@apollo/client/react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { getPopberGqlFilterForTree } from './getPopberGqlFilterForTree.ts'

export const usePopbersNavData = (props?: { projId?: string | undefined; apId?: string | undefined; popId?: string | undefined } | undefined) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = (props?.projId ?? params.projId)!
  const apId = (props?.apId ?? params.apId)!
  const popId = (props?.popId ?? params.popId)!

  // Get filter before useQuery so changes trigger refetch
  const popberGqlFilterForTree = getPopberGqlFilterForTree(popId!)

  const { data } = useSuspenseQuery({
    queryKey: ['treePopber', popId, popberGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: graphql(`
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
        `),
        variables: {
          popbersFilter: popberGqlFilterForTree,
          popId,
        },
      })
      if (result.error) throw result.error
      // errors are thrown above, so data is defined
      return result.data!
    },
  })

  const count = data.popById?.popbersByPopId.nodes.length
  const totalCount = data.popById?.totalCount.totalCount

  const navData = {
    id: 'Kontroll-Berichte',
    listFilter: 'popber',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Populationen/${popId}/Kontroll-Berichte`,
    label: `Kontroll-Berichte (${count}/${totalCount})`,
    treeNodeType: 'folder',
    treeMenuType: 'popberFolder',
    treeId: `${popId}popberFolder`,
    treeTableId: popId,
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
    menus: data.popById?.popbersByPopId.nodes.map((p) => ({
      id: p?.id,
      label: p?.label,
      treeNodeType: 'table',
      treeMenuType: 'popber',
      treeId: p?.id,
      treeTableId: p?.id,
      treeParentTableId: popId,
      treeUrl: [
        'Projekte',
        projId,
        'Arten',
        apId,
        'Populationen',
        popId,
        'Kontroll-Berichte',
        p?.id,
      ],
      hasChildren: false,
    })),
  }

  return navData
}
