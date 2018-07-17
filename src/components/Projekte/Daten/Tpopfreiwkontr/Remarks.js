// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import TextField from '../../../shared/TextField'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
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
const RemarksSubLabel = styled.div`
  padding-top: 10px;
  font-weight: 700;
  font-size: 14px;
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
  const row = get(data, 'tpopkontrById')

  return (
    <Container>
      <RemarksLabel>Spezielle Bemerkungen</RemarksLabel>
      <RemarksSubLabel>
        (z.B. allgemeiner Eindruck, Zunahme / Abnahme Begründung, spezielle
        Begebenheiten)
      </RemarksSubLabel>
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
