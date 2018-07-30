// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import TextField from '../../../shared/TextField'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: remarks;
  > div {
    margin-top: 10px;
    margin-bottom: -20px;
  }
`
const RemarksLabel = styled.div`
  font-weight: 700;
`
const RemarksSubLabel = styled.span`
  padding-left: 5px;
  font-weight: 700;
  font-size: 14px;
  @media print {
    font-size: 11px;
  }
`

const Remarks = ({
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
      <RemarksLabel>
        Spezielle Bemerkungen
        <RemarksSubLabel>
          (z.B. allgemeiner Eindruck, Zunahme / Abnahme Begründung, spezielle
          Begebenheiten)
        </RemarksSubLabel>
      </RemarksLabel>
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
    </Container>
  )
}

export default Remarks
