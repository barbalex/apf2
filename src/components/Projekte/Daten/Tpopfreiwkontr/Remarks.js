// @flow
import React from 'react'
import styled from 'styled-components'

import TextField from '../../../shared/TextField'

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  grid-area: remarks;
`
const RemarksLabel = styled.div`
  font-weight: 700;
  margin-bottom: -10px;
`
const RemarksSubLabel = styled.span`
  padding-left: 5px;
  font-weight: 700;
  font-size: 14px;
  @media print {
    font-size: 11px;
  }
`
const RemarksVal = styled.div`
  > div {
    margin-bottom: -15px;
  }
  > div > div > div > textarea {
    @media print {
      font-size: 11px !important;
    }
  }
`

const Remarks = ({
  saveToDb,
  errors,
  row,
  updateTpopkontr,
}: {
  saveToDb: () => void,
  errors: Object,
  row: Object,
  updateTpopkontr: () => void,
}) => (
  <Container>
    <RemarksLabel>
      Spezielle Bemerkungen
      <RemarksSubLabel>
        (z.B. allgemeiner Eindruck, Zunahme / Abnahme Begründung, spezielle
        Begebenheiten)
      </RemarksSubLabel>
    </RemarksLabel>
    <RemarksVal>
      <TextField
        key={`${row.id}bemerkungen`}
        value={row.bemerkungen}
        type="text"
        multiLine
        saveToDb={value =>
          saveToDb({
            row,
            field: 'bemerkungen',
            value,
            updateTpopkontr,
          })
        }
        error={errors.bemerkungen}
      />
    </RemarksVal>
  </Container>
)

export default Remarks
