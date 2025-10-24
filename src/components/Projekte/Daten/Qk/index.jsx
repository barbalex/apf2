import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { Qk } from './Qk/index.jsx'
import { query } from './query.js'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.jsx'
import { Error } from '../../../shared/Error.jsx'
import { Spinner } from '../../../shared/Spinner.jsx'

export const Component = () => {
  const { apId } = useParams()

  const { data, loading, error } = useQuery(query, {
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

  const qkCount = data?.allQks?.totalCount

  if (error) return <Error error={error} />

  if (loading) return <Spinner />

  return (
    <ErrorBoundary>
      <Qk
        key={qkCount}
        qkNameQueries={qkNameQueries}
        qks={qks}
      />
    </ErrorBoundary>
  )
}
