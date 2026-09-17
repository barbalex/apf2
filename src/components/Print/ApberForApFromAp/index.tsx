import { Suspense } from 'react'
import { graphql } from '../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { apByIdJahr } from './apByIdJahr.ts'
import { ApberForAp } from '../ApberForAp/index.tsx'
import type {
  ApberForApApNode,
  ApberForApJberAbcNode,
} from '../ApberForAp/types.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { Spinner } from '../../shared/Spinner.tsx'
import type { ApberId } from '../../../models/apflora/index.ts'

interface ApberQueryResult {
  apberById: {
    id: ApberId
    jahr: number | null
  } | null
}

// result type of the apByIdJahr query (apByIdJahr.ts)
interface ApByIdJahrQueryResult {
  apById: ApberForApApNode | null
  jberAbcByApId: {
    nodes: ApberForApJberAbcNode[]
  } | null
}
export const Component = () => {
  const { apberId, apId } = useParams()

  const apolloClient = useApolloClient()

  const { data, error } = useQuery({
    queryKey: ['apByIdJahrForApberForApFromAp', apberId, apId],
    queryFn: async () => {
      const { data: apberData, error: apberError } = await apolloClient.query<ApberQueryResult>({
        query: graphql(`
          query apberById($apberId: UUID!) {
            apberById(id: $apberId) {
              id
              jahr
            }
          }
        `),
        variables: {
          apberId,
          apId,
        },
      })
      const jahr = apberData?.apberById?.jahr
      if (apberError) throw apberError
      if (!jahr) throw new Error('im AP-Bericht fehlt das Jahr')

      const { data, error } = await apolloClient.query<ApByIdJahrQueryResult>({
        query: apByIdJahr,
        variables: { apId, jahr },
      })
      if (error) throw error
      return { data, jahr }
    },
  })

  const jahr = data?.jahr

  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <ApberForAp
          apId={apId}
          jahr={jahr}
          apData={data?.data}
          node={data?.data?.jberAbcByApId?.nodes?.[0]}
        />
      </Suspense>
    </ErrorBoundary>
  )
}
