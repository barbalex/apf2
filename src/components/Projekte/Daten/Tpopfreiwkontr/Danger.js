// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'

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

const enhance = compose(
  onlyUpdateForKeys(['id', 'gefaehrdung', 'errorsGefaehrdung']),
)

const Danger = ({
  id,
  gefaehrdung,
  saveToDb,
  errorsGefaehrdung,
  row,
  updateTpopkontr,
}: {
  id: string,
  gefaehrdung: string,
  saveToDb: () => void,
  errorsGefaehrdung: string,
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
        key={`${id}gefaehrdung`}
        value={gefaehrdung}
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
        error={errorsGefaehrdung}
      />
    </DangerVal>
  </Container>
)

export default enhance(Danger)
