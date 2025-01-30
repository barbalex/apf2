import { useState, useEffect } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useParams } from 'react-router'

import { ApberForYear } from './ApberForYear.jsx'
import { MobxContext } from '../../../mobxContext.js'
import { ErrorBoundary } from '../../shared/ErrorBoundary.jsx'
import { Spinner } from '../../shared/Spinner.jsx'

export const Component = () => {
  const { apberuebersichtId = '99999999-9999-9999-9999-999999999999' } =
    useParams()

  const { data, loading, error } = useQuery(
    gql`
      query apberuebersichtByIdForApberForYear($apberuebersichtId: UUID!) {
        apberuebersichtById(id: $apberuebersichtId) {
          id
          jahr
        }
      }
    `,
    {
      variables: { apberuebersichtId },
    },
  )
  const year = data?.apberuebersichtById?.jahr

  if (error) {
    return `Fehler: ${error.message}`
  }

  if (loading || !year) return <Spinner />

  return (
    <ErrorBoundary>
      <ApberForYear
        jahr={year}
        apberuebersichtId={apberuebersichtId}
      />
    </ErrorBoundary>
  )
}
