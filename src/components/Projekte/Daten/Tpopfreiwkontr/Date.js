// @flow
import React from 'react'
import styled from 'styled-components'
import format from 'date-fns/format'
import get from 'lodash/get'

import DateFieldWithPicker from '../../../shared/DateFieldWithPicker'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
`
const Container = styled(Area)`
  grid-area: date;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas: 'dateLabel dateVal dateVal';
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
  padding-right: 4px;
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
`

const Date = ({
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
      <DateLabel>Aufnahme-datum</DateLabel>
      <DateVal>
        <DateFieldWithPicker
          key={`${row.id}datum`}
          value={row.datum}
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
          error={errors.datum}
        />
      </DateVal>
    </Container>
  )
}

export default Date
