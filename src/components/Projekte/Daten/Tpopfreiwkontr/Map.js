// @flow
import React from 'react'
import styled from 'styled-components'
import get from 'lodash/get'

import RadioButton from '../../../shared/RadioButton'

const Area = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 6px;
  padding: 10px;
  break-inside: avoid;
`
const Container = styled(Area)`
  grid-area: map;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'mapLabel0 mapLabel1 mapVal1'
    'mapLabel0 mapLabel2 mapVal2';
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
  padding-right: 4px;
`
const MapLabel0 = styled(Label)`
  grid-area: mapLabel0;
  padding-right: 15px;
`
const MapLabel1 = styled(Label)`
  grid-area: mapLabel1;
`
const MapLabel2 = styled(Label)`
  grid-area: mapLabel2;
`
const MapVal1 = styled(Label)`
  grid-area: mapVal1;
  > fieldset {
    margin-top: -5px;
    padding-bottom: 0 !important;
  }
  > fieldset > legend {
    padding-top: 0 !important;
  }
`
const MapVal2 = styled(Label)`
  grid-area: mapVal2;
  > fieldset {
    margin-top: -5px;
    padding-bottom: 0 !important;
  }
  > fieldset > legend {
    padding-top: 0 !important;
  }
`

const Map = ({
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
      <MapLabel0>Plan ergänzt</MapLabel0>
      <MapLabel1>ja</MapLabel1>
      <MapVal1>
        <RadioButton
          key={`${row.id}planVorhanden`}
          value={row.planVorhanden}
          saveToDb={value =>
            saveToDb({
              row,
              field: 'planVorhanden',
              value,
              updateTpopkontr,
            })
          }
          error={errors.planVorhanden}
        />
      </MapVal1>
      <MapLabel2>nein</MapLabel2>
      <MapVal2>
        <RadioButton
          key={`${row.id}planVorhanden`}
          value={!row.planVorhanden}
          saveToDb={value =>
            saveToDb({
              row,
              field: 'planVorhanden',
              value: !value,
              updateTpopkontr,
            })
          }
          error={errors.planVorhanden}
        />
      </MapVal2>
    </Container>
  )
}

export default Map
