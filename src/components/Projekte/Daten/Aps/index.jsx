import { memo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { StoreContext } from '../../../../storeContext.js'
import { createApsQuery } from '../../../../modules/createApsQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Menu } from './Menu.jsx'

export const Component = memo(
  observer(() => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { apGqlFilterForTree } = store.tree

    const { data } = useQuery(
      createApsQuery({
        projectId: projekt.id,
        apGqlFilterForTree,
        apolloClient,
      }),
    )
    const aps = data?.data?.allAps?.nodes ?? []
    const totalCount = data?.data?.totalCount?.totalCount ?? 0

    return (
      <List
        items={aps}
        title="Arten"
        totalCount={totalCount}
        menuBar={Menu}
      />
    )
  }),
)
