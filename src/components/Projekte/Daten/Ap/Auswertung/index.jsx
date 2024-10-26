import React from 'react'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'

import { ApErfolg } from './ApErfolg/index.jsx'
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
    tabIndex={-1}
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
