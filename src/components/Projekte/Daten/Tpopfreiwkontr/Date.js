// @flow
import React from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import compose from 'recompose/compose'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'

import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'

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

const enhance = compose(onlyUpdateForKeys(['id', 'datum', 'errorsDatum']))

const Date = ({
  id,
  datum,
  saveToDb,
  errorsDatum,
  row,
  updateTpopkontr,
}: {
  id: string,
  datum: string,
  saveToDb: () => void,
  errorsDatum: string,
  row: Object,
  updateTpopkontr: () => void,
}) => (
  <Container>
    <DateLabel>Aufnahme-datum</DateLabel>
    <DateVal>
      <DateFieldWithPicker
        key={`${id}datum`}
        value={datum}
        saveToDb={value => {
          saveToDb({
            row,
            field: 'datum',
            value,
            field2: 'jahr',
            value2: !!value ? format(value, 'YYYY') : null,
            updateTpopkontr,
          })
        }}
        error={errorsDatum}
      />
    </DateVal>
  </Container>
)

export default enhance(Date)
