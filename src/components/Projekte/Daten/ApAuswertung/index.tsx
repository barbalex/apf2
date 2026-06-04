import { useParams } from 'react-router'
import { gql } from '@apollo/client'
import { useApolloClient } from '@apollo/client/react'
import { useQuery } from '@tanstack/react-query'

import { ApErfolg } from './ApErfolg/index.tsx'
import { PopStatus } from './PopStatus/index.tsx'
import { PopMenge } from './PopMenge/index.tsx'
import { TpopKontrolliert } from './TpopKontrolliert/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.tsx'

import type { ApId } from '../../../../models/apflora/Ap.ts'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.ts'

import styles from './index.module.css'

const apAuswertungQuery = gql`
  query apAuswertungQuery($apId: UUID!) {
    apById(id: $apId) {
      id
      aeTaxonomyByArtId {
        id
        artname
      }
    }
  }
`

interface ApAuswertungQueryResult {
  apById: {
    id: ApId
    aeTaxonomyByArtId: {
      id: AeTaxonomiesId
      artname: string
    } | null
  }
}

export const Component = () => {
  const apolloClient = useApolloClient()

  const { apId } = useParams<{ apId: string }>()
  const { data } = useQuery({
    queryKey: ['apAuswertung', apId],
    queryFn: async () => {
      const result = await apolloClient.query<ApAuswertungQueryResult>({
        query: apAuswertungQuery,
        variables: { apId },
      })
      if (result.error) throw result.error
      return result.data
    },
    suspense: true,
  })

  const artname = data.apById.aeTaxonomyByArtId.artname ?? 'Art'

  return (
    <>
      <FormTitle title={`${artname}: Auswertung`} />
      <div className={styles.scrollContainer}>
        <div className={styles.formContainer}>
          <ApErfolg />
          <PopStatus />
          <PopMenge />
          <TpopKontrolliert />
        </div>
      </div>
    </>
  )
}
