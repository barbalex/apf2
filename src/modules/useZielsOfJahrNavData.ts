import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { useAtomValue } from 'jotai'

import { store, treeZielGqlFilterForTreeAtom } from '../store/index.ts'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useZielsOfJahrNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId
  let jahr = props?.jahr ?? params.jahr
  jahr = jahr ? +jahr : jahr

  const zielGqlFilterForTree = useAtomValue(treeZielGqlFilterForTreeAtom)

  const { data } = useQuery({
    queryKey: ['treeZielsOfJahr', apId, jahr, zielGqlFilterForTree],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query TreeZielsOfJahrQuery(
            $zielsFilter: ZielFilter!
            $jahrFilter: ZielFilter!
            $apId: UUID!
          ) {
            apById(id: $apId) {
              id
              zielsByApId(filter: $jahrFilter) {
                totalCount
              }
              filteredZiels: zielsByApId(
                filter: $zielsFilter
                orderBy: [JAHR_ASC, LABEL_ASC]
              ) {
                nodes {
                  id
                  label
                  jahr
                }
              }
            }
          }
        `,
        variables: {
          jahrFilter: {
            jahr: { equalTo: +jahr },
          },
          zielsFilter: {
            ...zielGqlFilterForTree,
            jahr: { equalTo: +jahr },
          },
          apId,
        },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const count = data.apById.zielsByApId.totalCount
  const filteredZiels = data.apById.filteredZiels.nodes

  const navData = {
    id: jahr,
    listFilter: 'ziel',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/AP-Ziele/${jahr}`,
    label: `Ziele für ${jahr} (${filteredZiels.length}/${count})`,
    labelShort: `${jahr} (${filteredZiels.length}/${count})`,
    treeNodeType: 'folder',
    treeMenuType: 'zielJahrFolder',
    treeId: `${apId}ApzielJahrFolder`,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr],
    hasChildren: !!filteredZiels.length,
    fetcherName: 'useZielsOfJahrNavData',
    fetcherParams: { projId, apId, jahr },
    component: NodeWithList,
    menus: filteredZiels.map((p) => ({
      id: p.id,
      label: p.label,
      jahr: p.jahr,
      treeNodeType: 'table',
      treeMenuType: 'ziel',
      treeId: p.id,
      treeParentTableId: apId,
      treeUrl: ['Projekte', projId, 'Arten', apId, 'AP-Ziele', jahr, p.id],
      fetcherName: 'useZielNavData',
      fetcherParams: { projId, apId, jahr, zielId: p.id },
      hasChildren: !!filteredZiels.length,
    })),
  }

  return navData
}
