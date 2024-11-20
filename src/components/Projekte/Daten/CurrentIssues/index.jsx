import { memo } from 'react'
import { useApolloClient } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'

import { createCurrentissuesQuery } from '../../../../modules/createCurrentissuesQuery.js'
import { List } from '../../../shared/List/index.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'
import { Error } from '../../../shared/Error.jsx'

export const Component = memo(() => {
  const apolloClient = useApolloClient()

  const { data, isLoading, error } = useQuery(
    createCurrentissuesQuery({
      apolloClient,
    }),
  )
  const currentissues = data?.data?.allCurrentissues?.nodes ?? []
  const totalCount = data?.data?.totalCount?.totalCount ?? 0

  if (isLoading) return <Spinner />

  if (error) return <Error error={error} />

  return (
    <List
      items={currentissues}
      title="Aktuelle Fehler"
      totalCount={totalCount}
    />
  )
})
