import { gql } from '@apollo/client'

const userNodes = async ({ store, treeQueryVariables }) => {
  const { data } = await store.queryClient.fetchQuery({
    queryKey: ['treeUsers', treeQueryVariables.usersFilter],
    queryFn: async () =>
      store.client.query({
        query: gql`
          query TreeUsersQuery($usersFilter: UserFilter!) {
            allUsers(filter: $usersFilter, orderBy: LABEL_ASC) {
              nodes {
                id
                label
              }
            }
          }
        `,
        variables: { usersFilter: treeQueryVariables.usersFilter },
        fetchPolicy: 'no-cache',
      }),
  })

  // map through all elements and create array of nodes
  const nodes = (data?.allUsers?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'user',
    id: el.id,
    urlLabel: el.id,
    label: el.label,
    url: ['Benutzer', el.id],
    hasChildren: false,
  }))

  return nodes
}

export default userNodes
