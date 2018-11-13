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

const enhance = compose(
  onlyUpdateForKeys(['id', 'bemerkungen', 'errorsBemerkungen']),
)

const Remarks = ({
  id,
  bemerkungen,
  errorsBemerkungen,
  saveToDb,
  row,
}: {
  id: string,
  bemerkungen: string,
  errorsBemerkungen: string,
  saveToDb: () => void,
  row: Object,
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
        key={`${id}bemerkungen`}
        name="bemerkungen"
        value={bemerkungen}
        type="text"
        multiLine
        saveToDb={saveToDb}
        error={errorsBemerkungen}
      />
    </RemarksVal>
  </Container>
)

export default enhance(Remarks)
