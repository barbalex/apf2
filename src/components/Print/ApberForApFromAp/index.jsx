import { gql } from '@apollo/client';
import { useApolloClient } from "@apollo/client/react";
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'

import { apByIdJahr } from './apByIdJahr.js'
import { ApberForAp } from '../ApberForAp/index.jsx'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../shared/Spinner.jsx'

export const Component = () => {
  const { apberId, apId } = useParams()

  const client = useApolloClient()

  const { data, error, isLoading } = useQuery({
    queryKey: ['apByIdJahrForApberForApFromAp', apberId, apId],
    queryFn: async () => {
      const { data: apberData, error: apberError } = await client.query({
        query: gql`
          query apberById($apberId: UUID!) {
            apberById(id: $apberId) {
              id
              jahr
            }
          }
        `,
        variables: {
          apberId,
          apId,
        },
        fetchPolicy: 'no-cache',
      })
      const jahr = apberData?.apberById?.jahr
      if (apberError) throw apberError
      if (!jahr) throw new Error('im AP-Bericht fehlt das Jahr')

      const { data, error } = await client.query({
        query: apByIdJahr,
        variables: { apId, jahr },
        fetchPolicy: 'no-cache',
      })
      if (error) throw error
      return { data, jahr }
    },
  })

  const jahr = data?.jahr

  if (isLoading) return <Spinner />
  if (error) return `Fehler: ${error.message}`

  return (
    <ErrorBoundary>
      <ApberForAp
        apId={apId}
        jahr={jahr}
        apData={data?.data}
        node={data?.data?.jberAbcByApId?.nodes?.[0]}
      />
    </ErrorBoundary>
  )
}
