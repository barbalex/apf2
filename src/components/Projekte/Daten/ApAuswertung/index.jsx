import { memo } from 'react'
import styled from '@emotion/styled'
import { useParams } from 'react-router'
import { useQuery, gql } from '@apollo/client'

import { ApErfolg } from './ApErfolg/index.jsx'
import { PopStatus } from './PopStatus/index.jsx'
import { PopMenge } from './PopMenge/index.jsx'
import { TpopKontrolliert } from './TpopKontrolliert/index.jsx'
import { FormTitle } from '../../../shared/FormTitle/index.jsx'

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

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  padding: 10px;
  padding-top: 0;
`

export const Component = memo(() => {
  const { apId } = useParams()
  const { data } = useQuery(apAuswertungQuery, {
    variables: { apId },
  })

  const artname = data?.apById?.aeTaxonomyByArtId?.artname ?? 'Art'

  return (
    <>
      <FormTitle title={`${artname}: Auswertung`} />
      <FormContainer>
        <ApErfolg />
        <PopStatus />
        <PopMenge />
        <TpopKontrolliert />
      </FormContainer>
    </>
  )
})
