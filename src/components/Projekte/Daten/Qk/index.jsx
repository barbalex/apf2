import { memo } from 'react'
import { useQuery } from '@apollo/client'
import { useParams } from 'react-router-dom'

import { Qk } from './Qk/index.jsx'
import { query } from './query.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

export const Component = memo(() => {
  const { apId } = useParams()

  const { data, loading, error, refetch } = useQuery(query, {
    variables: { apId },
    fetchPolicy: 'no-cache',
  })
  /**
   * DO NOT get allQks.nodes.apqksByQkName.totalCount
   * AS THIS IS NEVER UPDATED
   */
  const allQks = data?.allQks.nodes ?? []
  const qks = allQks.filter(
    (qk) => !!(data?.allApqks?.nodes ?? []).find((no) => no.qkName === qk.name),
  )
  const qkNameQueries = Object.fromEntries(
    allQks.map((n) => [
      n.name,
      !!(data?.allApqks?.nodes ?? []).find((no) => no.qkName === n.name),
    ]),
  )

  const qkCount = loading ? '...' : data?.allQks?.totalCount

  if (error) return <Error error={error} />

  return (
    <ErrorBoundary>
      {loading ?
        <Spinner />
      : <Qk
          key={qkCount}
          qkNameQueries={qkNameQueries}
          qks={qks}
        />
      }
    </ErrorBoundary>
  )
})
