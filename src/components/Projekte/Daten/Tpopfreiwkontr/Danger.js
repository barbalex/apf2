// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import TextField from '../../../shared/TextField'

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  grid-area: danger;
`
const DangerLabel = styled.div`
  font-weight: 700;
  margin-bottom: -10px;
`
const DangerSubLabel = styled.span`
  padding-left: 5px;
  font-weight: 700;
  font-size: 14px;
  @media print {
    font-size: 11px;
  }
`
const DangerVal = styled.div`
  > div {
    margin-bottom: -15px;
  }
  > div > div > div > textarea {
    @media print {
      font-size: 11px !important;
    }
  }
`

const Danger = ({
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
    <DangerLabel>
      Gefährdung{' '}
      <DangerSubLabel>
        (Problemarten, Verbuschung, Tritt, Hunde, ...), welche?
      </DangerSubLabel>
    </DangerLabel>
    <DangerVal>
      <TextField
        key={`${row.id}gefaehrdung`}
        value={row.gefaehrdung}
        type="text"
        multiLine
        saveToDb={value =>
          saveToDb({
            row,
            field: 'gefaehrdung',
            value,
            updateTpopkontr,
          })
        }
        error={errors.gefaehrdung}
      />
    </DangerVal>
  </Container>
)

export default Danger
