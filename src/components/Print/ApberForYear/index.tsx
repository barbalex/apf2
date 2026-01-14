import { useState, useEffect } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useParams } from 'react-router'

import { ApberForYear } from './ApberForYear.tsx'
import { MobxContext } from '../../../mobxContext.ts'
import { ErrorBoundary } from '../../shared/ErrorBoundary.tsx'
import { Spinner } from '../../shared/Spinner.tsx'

import type { ApberuebersichtId } from '../../../models/apflora/public/Apberuebersicht.ts'

interface ApberuebersichtQueryResult {
  apberuebersichtById: {
    id: ApberuebersichtId
    jahr: number | null
  } | null
}

export const Component = () => {
  const { apberuebersichtId = '99999999-9999-9999-9999-999999999999' } =
    useParams()

  const { data, loading, error } = useQuery<ApberuebersichtQueryResult>(
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
