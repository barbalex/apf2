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
  grid-area: ekfRemarks;
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
  onlyUpdateForKeys(['id', 'ekfBemerkungen', 'errorsEkfBemerkungen']),
)

const EkfRemarks = ({
  id,
  ekfBemerkungen,
  saveToDb,
  errorsEkfBemerkungen,
  row,
}: {
  id: string,
  ekfBemerkungen: string,
  saveToDb: () => void,
  errorsEkfBemerkungen: string,
  row: Object,
}) => (
  <Container>
    <RemarksLabel>Mitteilungen zwischen AV/Topos und Freiwilligen</RemarksLabel>
    <RemarksVal>
      <TextField
        key={`${id}ekfBemerkungen`}
        name="ekfBemerkungen"
        value={ekfBemerkungen}
        type="text"
        multiLine
        saveToDb={saveToDb}
        error={errorsEkfBemerkungen}
      />
    </RemarksVal>
  </Container>
)

export default enhance(EkfRemarks)
