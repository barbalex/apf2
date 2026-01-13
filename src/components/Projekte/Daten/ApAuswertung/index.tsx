import { useParams } from 'react-router'
import { gql } from '@apollo/client'

import { useQuery } from '@apollo/client/react'

import { ApErfolg } from './ApErfolg/index.tsx'
import { PopStatus } from './PopStatus/index.tsx'
import { PopMenge } from './PopMenge/index.tsx'
import { TpopKontrolliert } from './TpopKontrolliert/index.tsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

import type { ApId } from '../../../../models/apflora/Ap.js'
import type { AeTaxonomiesId } from '../../../../models/apflora/AeTaxonomies.js'

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
  const { apId } = useParams<{ apId: string }>()
  const { data } = useQuery<ApAuswertungQueryResult>(apAuswertungQuery, {
    variables: { apId },
  })

  const artname = data?.apById?.aeTaxonomyByArtId?.artname ?? 'Art'

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
