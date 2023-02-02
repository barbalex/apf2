import { gql } from '@apollo/client'

import user from './user'

const userFolderNode = async ({ store, treeQueryVariables }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.user ?? ''
  const { data, isLoading } = await store.queryClient.fetchQuery({
    queryKey: ['treeUserFolder', treeQueryVariables.usersFilter],
    queryFn: async () =>
      store.client.query({
        query: gql`
          query TreeUsersFolderQuery($usersFilter: UserFilter!) {
            allUsers(filter: $usersFilter) {
              totalCount
            }
          }
        `,
        variables: { usersFilter: treeQueryVariables.usersFilter },
        fetchPolicy: 'no-cache',
      }),
  })

  const count = data?.allUsers?.totalCount ?? 0
  const message = isLoading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  let children = []
  const isOpen = store.tree.openNodes.some(
    (nodeArray) => nodeArray[0] === 'Benutzer',
  )
  if (isOpen) {
    const userNodes = await user({ store, treeQueryVariables })
    children = userNodes
  }

  return [
    {
      nodeType: 'folder',
      menuType: 'userFolder',
      id: 'benutzerFolder',
      urlLabel: 'Benutzer',
      label: `Benutzer (${message})`,
      url: ['Benutzer'],
      hasChildren: count > 0,
      children,
    },
  ]
}

export default userFolderNode
