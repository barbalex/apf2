import { gql } from '@apollo/client'
import union from 'lodash/union'

import apzieljahrFolder from './apzieljahrFolder'

const apzielFolderNode = async ({
  projId,
  apId,
  store,
  treeQueryVariables,
}) => {
  // tried using tanstack query to refetch only this data - but it does not work
  const { data, isLoading } = await store.queryClient.fetchQuery({
    queryKey: ['treeApZieljahrFolder', apId, treeQueryVariables.zielsFilter],
    queryFn: async () => {
      const { data, loading: isLoading } = await store.client.query({
        query: gql`
          query TreeApZieljahrFolderQuery(
            $apId: UUID!
            $zielsFilter: ZielFilter!
          ) {
            apById(id: $apId) {
              id
              zielsByApId(filter: $zielsFilter, orderBy: LABEL_ASC) {
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
          apId,
          zielsFilter: treeQueryVariables.zielsFilter,
        },
        fetchPolicy: 'no-cache',
      })
      return { data, isLoading }
    },
  })

  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.ziel ?? ''

  const ziels = data?.apById?.zielsByApId?.nodes ?? []
  const zieljahre = ziels
    // reduce to distinct years
    .reduce((a, el) => union(a, [el.jahr]), [])
    .sort()
  const zieljahreLength = zieljahre.length
  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'} gefiltert`
    : `${zieljahreLength} ${zieljahreLength === 1 ? 'Jahr' : 'Jahre'}`

  const url = ['Projekte', projId, 'Arten', apId, 'AP-Ziele']

  const isOpen =
    store.tree.openNodes.filter(
      (n) =>
        n.length > 4 && n[1] === projId && n[3] === apId && n[4] === 'AP-Ziele',
    ).length > 0

  const children = isOpen
    ? await apzieljahrFolder({
        treeQueryVariables,
        projId,
        apId,
        store,
        zieljahre,
        ziels,
      })
    : []

  return {
    nodeType: 'folder',
    menuType: 'zielFolder',
    id: `${apId}ApzielFolder`,
    tableId: apId,
    urlLabel: 'AP-Ziele',
    label: `AP-Ziele (${message})`,
    url,
    hasChildren: zieljahreLength > 0,
    children,
  }
}

export default apzielFolderNode
