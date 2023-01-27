import React from 'react'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'

import ApErfolg from './ApErfolg'
import PopStatus from './PopStatus'
import PopMenge from './PopMenge'
import TpopKontrolliert from './TpopKontrolliert'

const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
`

const ApAuswertung = () => (
  <SimpleBar
    style={{
      maxHeight: '100%',
      height: '100%',
    }}
  >
    <FormContainer>
      <ApErfolg />
      <PopStatus />
      <PopMenge /> 
      <TpopKontrolliert />
    </FormContainer>
  </SimpleBar>
)

export default ApAuswertung
