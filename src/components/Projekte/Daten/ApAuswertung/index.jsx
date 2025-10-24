import styled from '@emotion/styled'
import { useParams } from 'react-router'
import { gql } from '@apollo/client'

import { useQuery } from '@apollo/client/react'

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

const ScrollContainer = styled.div`
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: thin;
  flex-shrink: 1;
`
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  padding: 10px;
  padding-top: 0;
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
      <ScrollContainer>
        <FormContainer>
          <ApErfolg />
          <PopStatus />
          <PopMenge />
          <TpopKontrolliert />
        </FormContainer>
      </ScrollContainer>
    </>
  )
}
