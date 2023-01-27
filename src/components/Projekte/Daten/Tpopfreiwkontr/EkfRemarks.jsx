import React from 'react'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import TextField from '../../../shared/TextField2'

const Container = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
  grid-area: ekfRemarks;
`
const RemarksLabel = styled.div`
  font-weight: 700;
  margin-bottom: -10px;
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

const EkfRemarks = ({ saveToDb, row, errors }) => (
  <Container>
    <RemarksLabel>Mitteilungen zwischen AV/Topos und Freiwilligen</RemarksLabel>
    <RemarksVal>
      <TextField
        key={`${row.id}ekfBemerkungen`}
        name="ekfBemerkungen"
        row={row}
        type="text"
        multiLine
        saveToDb={saveToDb}
        errors={errors}
      />
    </RemarksVal>
  </Container>
)

export default observer(EkfRemarks)
