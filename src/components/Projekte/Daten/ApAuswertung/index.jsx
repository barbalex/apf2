import { useParams } from 'react-router'
import { gql } from '@apollo/client'

import { useQuery } from '@apollo/client/react'

import { ApErfolg } from './ApErfolg/index.jsx'
import { PopStatus } from './PopStatus/index.jsx'
import { PopMenge } from './PopMenge/index.jsx'
import { TpopKontrolliert } from './TpopKontrolliert/index.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

import { scrollContainer, formContainer } from './index.module.css'

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

export const Component = () => {
  const { apId } = useParams()
  const { data } = useQuery(apAuswertungQuery, {
    variables: { apId },
  })

  const artname = data?.apById?.aeTaxonomyByArtId?.artname ?? 'Art'

  return (
    <>
      <FormTitle title={`${artname}: Auswertung`} />
      <div className={scrollContainer}>
        <div className={formContainer}>
          <ApErfolg />
          <PopStatus />
          <PopMenge />
          <TpopKontrolliert />
        </div>
      </div>
    </>
  )
}
