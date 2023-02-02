import { useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useQuery } from '@tanstack/react-query'
import { gql } from '@apollo/client'

import Row from '../Tree/Row'
import storeContext from '../../../../storeContext'

const UserFolderNode = ({ treeQueryVariables }) => {
  const store = useContext(storeContext)

  const { data } = useQuery({
    queryKey: ['treeUser', treeQueryVariables.usersFilter],
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

export default observer(UserFolderNode)
