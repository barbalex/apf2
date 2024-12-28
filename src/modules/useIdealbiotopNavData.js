import { useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { NodeWithList } from '../components/Projekte/TreeContainer/Tree/NodeWithList'

export const useIdealbiotopNavData = (props) => {
  const apolloClient = useApolloClient()
  const params = useParams()
  const projId = props?.projId ?? params.projId
  const apId = props?.apId ?? params.apId

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeIdealbiotop', apId],
    queryFn: () =>
      apolloClient.query({
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
        fetchPolicy: 'no-cache',
      }),
  })

  const idealbiotop = data?.data?.apById?.idealbiotopsByApId?.nodes?.[0]
  const filesCount =
    idealbiotop?.idealbiotopFilesByIdealbiotopId?.totalCount ?? 0

  const navData = useMemo(
    () => ({
      id: 'Idealbiotop',
      url: `/Daten/Projekte/${projId}/Arten/${apId}/Idealbiotop`,
      label: 'Idealbiotop',
      treeNodeType: 'folder',
      treeMenuType: 'idealbiotopFolder',
      treeId: `${apId}IdealbiotopFolder`,
      treeTableId: apId,
      treeTableParentId: apId,
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
          treeTableId: apId,
          treeUrl: [
            'Projekte',
            projId,
            'Arten',
            apId,
            'Idealbiotop',
            'Dateien',
          ],
          hasChildren: false,
        },
      ],
    }),
    [filesCount, apId, projId],
  )

  return { isLoading, error, navData }
}
