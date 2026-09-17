import { graphql } from '../../../gql/index.ts'
import { useApolloClient } from '@apollo/client/react'
import { useQuery, type UseQueryOptions } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ApberForYear } from './ApberForYear.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'

import type { ApberuebersichtQueryResult } from './types.ts'

// react-query v5 omitted suspense from the public useQuery options
// although it is still honored at runtime
type ApberuebersichtUseQueryOptions = UseQueryOptions<
  ApberuebersichtQueryResult | undefined,
  Error
> & {
  suspense: boolean
}

export const Component = () => {
  const apolloClient = useApolloClient()

  const { apberuebersichtId = '99999999-9999-9999-9999-999999999999' } =
    useParams()

  const queryOptions: ApberuebersichtUseQueryOptions = {
    queryKey: ['apberuebersichtForApberForYear', apberuebersichtId],
    queryFn: async () => {
      const result = await apolloClient.query<ApberuebersichtQueryResult>({
        query: graphql(`
          query apberuebersichtByIdForApberForYear($apberuebersichtId: UUID!) {
            apberuebersichtById(id: $apberuebersichtId) {
              id
              jahr
            }
          }
        `),
        variables: { apberuebersichtId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  }

  const { data } = useQuery(queryOptions)
  const year = data?.apberuebersichtById?.jahr

  return (
    <ErrorBoundary>
      <ApberForYear
        jahr={year}
        apberuebersichtId={apberuebersichtId}
      />
    </ErrorBoundary>
  )
}
