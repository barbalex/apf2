import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import DateField from '../../../shared/Date'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: date;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: 'dateLabel dateVal dateVal';
  grid-column-gap: 10px;
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
`
const DateLabel = styled(Label)`
  grid-area: dateLabel;
`
const DateVal = styled.div`
  grid-area: dateVal;
  > div {
    margin-top: 5px;
    padding-bottom: 0 !important;
  }
  @media print {
    input {
      font-size: 11px;
    }
  }
`

const Date = ({ saveToDb, row }) => (
  <Container>
    <DateLabel>Aufnahme-datum</DateLabel>
    <DateVal>
      <DateField
        key={`${row.id}datum`}
        name="datum"
        value={row.datum}
        saveToDb={saveToDb}
      />
    </DateVal>
  </Container>
)

export default observer(Date)
