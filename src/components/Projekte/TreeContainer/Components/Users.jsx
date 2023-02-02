import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'

import Row from '../Tree/Row'

const UserFolderNode = ({ usersFilter }) => {
  const client = useApolloClient()

  const { data } = useQuery({
    queryKey: ['treeUser', usersFilter],
    queryFn: async () =>
      client.query({
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
        variables: { usersFilter },
        fetchPolicy: 'no-cache',
      }),
  })
  const nodes = (data?.data?.allUsers?.nodes ?? []).map((el) => ({
    nodeType: 'table',
    menuType: 'user',
    id: el.id,
    urlLabel: el.id,
    label: el.label,
    url: ['Benutzer', el.id],
    hasChildren: false,
  }))

  if (!nodes.length) return null

  return nodes.map((node) => <Row key={node.id} node={node} />)
}

export default UserFolderNode
