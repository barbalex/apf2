import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList.tsx'

export const useIdealbiotopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const { data } = useQuery({
    queryKey: ['treeIdealbiotop', apId],
    queryFn: async () => {
      const result = await apolloClient.query({
        query: gql`
          query NavIdealbiotopQuery($apId: UUID!) {
            apById(id: $apId) {
              id
              label
              idealbiotopsByApId {
                nodes {
                  id
                  idealbiotopFilesByIdealbiotopId {
                    totalCount
                  }
                }
              }
            }
          }
        `,
        variables: { apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const idealbiotop = data.apById.idealbiotopsByApId.nodes[0]
  const filesCount =
    idealbiotop.idealbiotopFilesByIdealbiotopId.totalCount

  const navData = {
    id: 'Idealbiotop',
    url: `/Daten/Projekte/${projId}/Arten/${apId}/Idealbiotop`,
    label: 'Idealbiotop',
    treeNodeType: 'folder',
    treeMenuType: 'idealbiotopFolder',
    treeId: `${apId}IdealbiotopFolder`,
    treeParentTableId: apId,
    treeUrl: ['Projekte', projId, 'Arten', apId, 'Idealbiotop'],
    hasChildren: true,
    fetcherName: 'useIdealbiotopNavData',
    fetcherParams: { projId, apId },
    component: NodeWithList,
    menus: [
      {
        id: 'Idealbiotop',
        label: `Idealbiotop`,
        isSelf: true,
      },
      {
        id: 'Dateien',
        label: `Dateien (${filesCount})`,
        count: filesCount,
        treeNodeType: 'folder',
        treeMenuType: 'idealbiotopDateienFolder',
        treeId: `${apId}IdealbiotopDateienFolder`,
        treeParentTableId: apId,
        treeUrl: ['Projekte', projId, 'Arten', apId, 'Idealbiotop', 'Dateien'],
        hasChildren: false,
      },
    ],
  }

  return navData
}
