import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { Qk } from './Qk/index.tsx'
import { query } from './query.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'
import { Error } from '../../../shared/Error.tsx'
import { Spinner } from '../../../shared/Spinner.tsx'

import type {
  ApId,
  QkName,
  ApqkQkName,
} from '../../../../models/apflora/index.ts'

interface QkNode {
  name: QkName
  titel: string | null
  beschreibung: string | null
  sort: number | null
}

interface ApqkNode {
  apId: ApId
  qkName: ApqkQkName
}

interface QkQueryResult {
  allQks?: {
    totalCount: number
    nodes: QkNode[]
  }
  allApqks?: {
    totalCount: number
    nodes: ApqkNode[]
  }
}

export const Component = () => {
  const { apId } = useParams()

  const { data, loading, error } = useQuery<QkQueryResult>(query, {
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
