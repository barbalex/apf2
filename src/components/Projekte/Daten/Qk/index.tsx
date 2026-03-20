import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { Qk } from './Qk/index.tsx'
import { query } from './query.ts'
import { ErrorBoundary } from '../../../shared/ErrorBoundary.tsx'

import type {
  ApId,
  QkName,
  ApqkQkName,
} from '../../../../models/apflora/index.tsx'

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
  const apolloClient = useApolloClient()

  const { data, isLoading } = useQuery<QkQueryResult>({
    queryKey: ['qk', apId],
    queryFn: async () => {
      const result = await apolloClient.query<QkQueryResult>({
        query,
        variables: { apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    // no suspense as else the node will not turn red on click, only after QK's were queried
  })
  /**
   * DO NOT get allQks.nodes.apqksByQkName.totalCount
   * AS THIS IS NEVER UPDATED
   */
  const allQks = data?.allQks?.nodes ?? []
  const qks = allQks.filter(
    (qk) =>
      !!(data?.allApqks?.nodes ?? [])?.find((no) => no?.qkName === qk.name),
  )
  const qkNameQueries = Object.fromEntries(
    allQks.map((n) => [
      n.name,
      !!(data?.allApqks?.nodes ?? [])?.find((no) => no?.qkName === n.name),
    ]),
  )

  const qkCount = data?.allQks?.totalCount

  if (isLoading) {
    return <div>Lade Daten...</div>
  }

  return (
    <ErrorBoundary>
      <Qk
        key={qkCount}
        qkNameQueries={qkNameQueries ?? {}}
        qks={qks}
      />
    </ErrorBoundary>
  )
}
