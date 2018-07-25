// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

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
  grid-template-columns: 260px 45px 50px;
  grid-template-areas:
    'verifLabel0 verifLabel1 verifVal1'
    'verifLabel0 verifLabel2 verifVal2';
  grid-column-gap: 10px;
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
`
const VerifLabel0 = styled(Label)`
  grid-area: verifLabel0;
`
const VerifLabel1 = styled(Label)`
  grid-area: verifLabel1;
  justify-self: end;
`
const VerifLabel2 = styled(Label)`
  grid-area: verifLabel2;
  justify-self: end;
`
const VerifVal1 = styled(Label)`
  grid-area: verifVal1;
  > fieldset {
    margin-top: -5px;
    padding-bottom: 0 !important;
  }
  > fieldset > legend {
    padding-top: 0 !important;
  }
`
const VerifVal2 = styled(Label)`
  grid-area: verifVal2;
  > fieldset {
    margin-top: -5px;
    padding-bottom: 0 !important;
  }
  > fieldset > legend {
    padding-top: 0 !important;
  }
`

const Verification = ({
  saveToDb,
  errors,
  data,
  updateTpopkontr,
}: {
  saveToDb: () => void,
  errors: Object,
  data: Object,
  updateTpopkontr: () => void,
}) => {
  const row = get(data, 'tpopkontrById', {})

  return (
    <Container>
      <VerifLabel0>Im Jahresbericht berücksichtigen</VerifLabel0>
      <VerifLabel1>ja</VerifLabel1>
      <VerifVal1>
        <RadioButton
          key={`${row.id}ekfVerifiziert`}
          value={row.ekfVerifiziert}
          saveToDb={value =>
            saveToDb({
              row,
              field: 'ekfVerifiziert',
              value,
              updateTpopkontr,
            })
          }
          error={errors.ekfVerifiziert}
        />
      </VerifVal1>
      <VerifLabel2>nein</VerifLabel2>
      <VerifVal2>
        <RadioButton
          key={`${row.id}ekfVerifiziert2`}
          value={!row.ekfVerifiziert && row.ekfVerifiziert !== null}
          saveToDb={value =>
            saveToDb({
              row,
              field: 'ekfVerifiziert',
              value: !value,
              updateTpopkontr,
            })
          }
          error={errors.ekfVerifiziert}
        />
      </VerifVal2>
    </Container>
  )
}

export default Verification
