import { gql } from '@apollo/client'
import max from 'lodash/max'

import currentIssues from './currentIssues'

const currentIssuesFolderNode = async ({ store, treeQueryVariables }) => {
  const { data, isLoading } = await store.queryClient.fetchQuery({
    queryKey: ['treeCurrentIssuesFolder'],
    queryFn: async () =>
      store.client.query({
        query: gql`
          query TreeCurrentIssuesFolderQuery {
            allCurrentissues {
              totalCount
            }
          }
        `,
        fetchPolicy: 'no-cache',
      }),
  })

  const count = data?.allCurrentissues?.totalCount ?? 0

  let message = isLoading && !count ? '...' : max([count - 1, 0])

  let children = []
  const isOpen = store.tree.openNodes.some(
    (nodeArray) => nodeArray[0] === 'Aktuelle-Fehler',
  )
  if (isOpen) {
    const userNodes = await currentIssues({ store, treeQueryVariables })
    children = userNodes
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'currentIssuesFolder',
      id: 'currentIssuesFolder',
      urlLabel: 'Aktuelle-Fehler',
      label: `Aktuelle Fehler (${message})`,
      url: ['Aktuelle-Fehler'],
      hasChildren: count > 0,
      children,
    },
  ]
}

export default currentIssuesFolderNode
