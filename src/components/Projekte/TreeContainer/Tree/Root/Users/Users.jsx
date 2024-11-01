import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'

import { Row } from '../../Row.jsx'

export const Users = ({ usersFilter }) => {
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

  return (data?.data?.allUsers?.nodes ?? []).map((el) => {
    const node = {
      nodeType: 'table',
      menuType: 'user',
      id: el.id,
      urlLabel: el.id,
      label: el.label,
      url: ['Benutzer', el.id],
      hasChildren: false,
    }

    return (
      <Row
        key={el.id}
        node={node}
      />
    )
  })
}
