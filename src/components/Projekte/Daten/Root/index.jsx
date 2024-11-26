import { memo, useMemo, useContext } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { observer } from 'mobx-react-lite'

import { createCurrentissuesQuery } from '../../../../modules/createCurrentissuesQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'
import { StoreContext } from '../../../../storeContext.js'
import { createRootQuery } from '../../../../modules/createRootQuery.js'

export const Component = memo(
  observer(() => {
    const apolloClient = useApolloClient()
    const store = useContext(StoreContext)
    const { userGqlFilterForTree } = store.tree

    const { data, isLoading, error } = useQuery(
      createRootQuery({
        userGqlFilterForTree,
        apolloClient,
      }),
    )
    const totalCount = 5
    const usersCount = data?.data?.allUsers?.totalCount ?? 0
    const usersFilteredCount = data?.data?.filteredUsers?.totalCount ?? 0
    const messagesCount = data?.data?.allMessages?.totalCount ?? 0
    const currentIssuesCount = data?.data?.allCurrentissues?.totalCount ?? 0

    const items = useMemo(
      () => [
        {
          id: 'Projekte',
          label: `Projekte`,
        },
        {
          id: 'Benutzer',
          label: `Benutzer (${usersFilteredCount}/${usersCount})`,
        },
        {
          id: 'Werte-Listen',
          label: `Werte-Listen (4)`,
        },
        {
          id: 'Mitteilungen',
          label: `Mitteilungen (${messagesCount})`,
        },
        {
          id: 'Aktuelle-Fehler',
          label: `Aktuelle Fehler (${currentIssuesCount})`,
        },
      ],
      [usersCount, messagesCount, currentIssuesCount],
    )

    if (isLoading) return <Spinner />

    if (error) return <Error error={error} />

    return (
      <List
        items={items}
        title="AP Flora"
        totalCount={totalCount}
      />
    )
  }),
)
