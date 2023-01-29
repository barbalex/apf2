import { gql } from '@apollo/client'

const userFolderNode = async ({ store, treeQueryVariables }) => {
  const nodeLabelFilterString = store.tree?.nodeLabelFilter?.user ?? ''

  const { data, loading } = await store.client.query({
    query: gql`
      query TreeUsersFolderQuery($usersFilter: UserFilter!) {
        allUsers(filter: $usersFilter) {
          totalCount
        }
      }
    `,
    variables: { usersFilter: treeQueryVariables.usersFilter },
  })

  const count = data?.allUsers?.totalCount ?? 0
  const message = loading
    ? '...'
    : nodeLabelFilterString
    ? `${count} gefiltert`
    : count

  return [
    {
      nodeType: 'folder',
      menuType: 'userFolder',
      filterTable: 'user',
      id: 'benutzerFolder',
      urlLabel: 'Benutzer',
      label: `Benutzer (${message})`,
      url: ['Benutzer'],
      hasChildren: count > 0,
    },
  ]
}

export default userFolderNode
