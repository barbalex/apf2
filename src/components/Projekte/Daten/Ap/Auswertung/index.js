import React from 'react'
import styled from 'styled-components'

import ApErfolg from './ApErfolg'
import PopStatus from './PopStatus'
import PopMenge from './PopMenge'
import TpopKontrolliert from './TpopKontrolliert'

const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
  overflow-y: auto !important;
  height: calc(100% - 43px - 48px + 4px);
`

const ApAuswertung = ({ id }) => {
  return (
    <FormContainer>
      <ApErfolg id={id} />
      <PopStatus id={id} />
      <PopMenge id={id} />
      <TpopKontrolliert id={id} />
    </FormContainer>
  )
}

export default ApAuswertung
