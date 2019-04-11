import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import RadioButton from '../../../shared/RadioButton'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  border-color: red;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: verification;
  display: grid;
  grid-template-columns: 290px 50px;
  grid-template-areas: 'verifLabel verifVal';
  grid-column-gap: 10px;
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
`
const VerifLabel1 = styled(Label)`
  grid-area: verifLabel;
`
const VerifVal1 = styled(Label)`
  grid-area: verifVal;
  > fieldset {
    margin-top: -5px;
    padding-bottom: 0 !important;
  }
  > fieldset > legend {
    padding-top: 0 !important;
  }
`

const Verification = ({ saveToDb, row, errors }) => (
  <Container>
    <VerifLabel1>Im Jahresbericht nicht berücksichtigen</VerifLabel1>
    <VerifVal1>
      <RadioButton
        key={`${row.id}ekfVerifiziert2`}
        name="ekfVerifiziert"
        value={row.ekfVerifiziert === false}
        saveToDb={saveToDb}
        error={errors.ekfVerifiziert}
      />
    </VerifVal1>
  </Container>
)

export default observer(Verification)
