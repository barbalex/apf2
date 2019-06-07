import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import RadioButton from '../../../shared/RadioButton'
import TextField from '../../../shared/TextField2'

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
  grid-template-columns: 220px 1fr;
  grid-template-areas:
    'title title'
    'relevant grund';
  grid-column-gap: 10px;
`
const Title = styled.div`
  grid-area: title;
  font-weight: 700;
  margin-bottom: 8px;
`
const Relevant = styled.div`
  grid-area: relevant;
  fieldset {
    border-collapse: separate;
  }
  fieldset > legend {
    padding-top: 0 !important;
  }
`
const Grund = styled.div`
  grid-area: grund;
`

const Verification = ({ saveToDb, row, errors }) => (
  <Container>
    <Title>Verifikation</Title>
    <Relevant>
      <RadioButton
        key={`${row.id}apberNichtRelevant`}
        name="apberNichtRelevant"
        label="Im Jahresbericht nicht berücksichtigen"
        value={row.apberNichtRelevant}
        saveToDb={saveToDb}
        error={errors.apberNichtRelevant}
      />
    </Relevant>
    <Grund>
      <TextField
        key={`${row.id}apberNichtRelevantGrund`}
        name="apberNichtRelevantGrund"
        label="Wieso nicht?"
        row={row}
        type="text"
        multiLine
        saveToDb={saveToDb}
        errors={errors}
      />
    </Grund>
  </Container>
)

export default observer(Verification)
