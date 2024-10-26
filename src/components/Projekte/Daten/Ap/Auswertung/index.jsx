import React from 'react'
import styled from '@emotion/styled'
import SimpleBar from 'simplebar-react'

import { ApErfolg } from './ApErfolg/index.jsx'
import { PopStatus } from './PopStatus/index.jsx'
import { PopMenge } from './PopMenge/index.jsx'
import { TpopKontrolliert } from './TpopKontrolliert/index.jsx'

const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
`

export const Auswertung = () => (
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

export default Auswertung
