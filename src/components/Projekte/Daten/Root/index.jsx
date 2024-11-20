import { memo, useMemo } from 'react'
import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import { createCurrentissuesQuery } from '../../../../modules/createCurrentissuesQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(() => {
  const apolloClient = useApolloClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['treeRoot'],
    queryFn: () =>
      apolloClient.query({
        query: gql`
          query TreeRootQuery {
            allUsers {
              totalCount
            }
            allMessages {
              totalCount
            }
            allCurrentissues {
              totalCount
            }
          }
        `,
        fetchPolicy: 'no-cache',
      }),
  })
  const totalCount = 5
  const usersCount = data?.data?.allUsers?.totalCount ?? 0
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
        label: `Benutzer (${usersCount})`,
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
})
