import { useApolloClient, gql } from '@apollo/client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'

import apQuery from './apByIdJahr'
import ApberForAp from '../ApberForAp'
import ErrorBoundary from '../../shared/ErrorBoundary'
import Spinner from '../../shared/Spinner'

const ApberForApFromAp = () => {
  const { apberId, apId } = useParams()

  const client = useApolloClient()

  const {
    data: apberData,
    error: apberDataError,
    loading: apberDataLoading,
  } = useQuery({
    queryKey: ['apberByIdForApFromAp', apberId, apId],
    queryFn: () =>
      client.query({
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
      }),
  })

  const jahr = apberData?.data?.apberById?.jahr ?? 0

  const {
    data: apData,
    isLoading: apDataLoading,
    error: apDataError,
  } = useQuery({
    queryKey: ['apByIdJahrForApberForApFromAp', apId, jahr],
    queryFn: () =>
      client.query({
        query: apQuery,
        variables: { apId, jahr: jahr ?? 0 },
        fetchPolicy: 'no-cache',
      }),
  })

  if (!jahr || apberDataLoading || apDataLoading) return <Spinner />
  if (apberDataError) return `Fehler: ${apberDataError.message}`
  if (apDataError) return `Fehler: ${apDataError.message}`

  return (
    <ErrorBoundary>
      <ApberForAp
        apId={apId}
        jahr={jahr}
        apData={apData?.data}
        node={apData?.data?.jberAbcByApId?.nodes?.[0]}
      />
    </ErrorBoundary>
  )
}

export const Component = ApberForApFromAp
