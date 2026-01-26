import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { ApberForYear } from './ApberForYear.tsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'

import type { ApberuebersichtId } from '../../../models/apflora/public/Apberuebersicht.ts'

interface ApberuebersichtQueryResult {
  apberuebersichtById: {
    id: ApberuebersichtId
    jahr: number | null
  } | null
}

export const Component = () => {
  const apolloClient = useApolloClient()

  const { apberuebersichtId = '99999999-9999-9999-9999-999999999999' } =
    useParams()

  const { data } = useQuery({
    queryKey: ['apberuebersichtForApberForYear', apberuebersichtId],
    queryFn: async () => {
      const result = await apolloClient.query<ApberuebersichtQueryResult>({
        query: gql`
          query apberuebersichtByIdForApberForYear($apberuebersichtId: UUID!) {
            apberuebersichtById(id: $apberuebersichtId) {
              id
              jahr
            }
          }
        `,
        variables: { apberuebersichtId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })
  const year = data.apberuebersichtById.jahr

  return (
    <ErrorBoundary>
      <ApberForYear jahr={year} apberuebersichtId={apberuebersichtId} />
    </ErrorBoundary>
  )
}
