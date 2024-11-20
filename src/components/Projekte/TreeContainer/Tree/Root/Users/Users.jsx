import { memo, useContext } from 'react'
import { useQuery } from '@tanstack/react-query'
import { gql, useApolloClient } from '@apollo/client'
import { observer } from 'mobx-react-lite'

import { Row } from '../../Row.jsx'
import { StoreContext } from '../../../../../../storeContext.js'
import { createUsersQuery } from '../../../../../../modules/createUsersQuery.js'

export const Users = memo(
  observer(({ usersFilter }) => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { userGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createUsersQuery({
        userGqlFilterForTree,
        apolloClient,
      }),
    )

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
  }),
)
