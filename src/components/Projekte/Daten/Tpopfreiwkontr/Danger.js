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
  grid-area: danger;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 8px;
  grid-template-areas: 'dangerLabel dangerVal dangerVal dangerVal';
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
  padding-right: 4px;
`
const DangerLabel = styled(Label)`
  grid-area: dangerLabel;
`
const DangerVal = styled.div`
  grid-area: dangerVal;
  > div {
    margin-bottom: -15px;
  }
`

const Danger = ({
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
  const row = get(data, 'tpopkontrById', {})

  return (
    <Container>
      <DangerLabel>
        Andere Gefährdung (Verbuschung, Tritt, Hunde, ...), welche?
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
}

export default Danger
