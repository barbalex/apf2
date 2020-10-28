import React from 'react'
import styled from 'styled-components'
import SimpleBar from 'simplebar-react'

import ApErfolg from './ApErfolg'
import PopStatus from './PopStatus'
import PopMenge from './PopMenge'
import TpopKontrolliert from './TpopKontrolliert'

const FormContainer = styled.div`
  padding: 10px;
  padding-top: 0;
`

const ApAuswertung = ({ id }) => {
  return (
    <SimpleBar
      style={{
        maxHeight: '100%',
        height: '100%',
      }}
    >
      <FormContainer>
        <ApErfolg id={id} />
        <PopStatus id={id} />
        <PopMenge id={id} />
        <TpopKontrolliert id={id} />
      </FormContainer>
    </SimpleBar>
  )
}

export default ApAuswertung
