import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import TextField from '../../../shared/TextField2'

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
    margin-bottom: -25px;
  }
  textarea {
    @media print {
      font-size: 11px !important;
    }
  }
`

const Remarks = ({ saveToDb, row, errors }) => {
  //console.log('Remarks rendering')

  return (
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
          name="bemerkungen"
          row={row}
          type="text"
          multiLine
          saveToDb={saveToDb}
          errors={errors}
        />
      </RemarksVal>
    </Container>
  )
}

export default observer(Remarks)
