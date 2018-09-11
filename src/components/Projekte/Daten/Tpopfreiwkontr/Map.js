// @flow
import React from 'react'
import styled from 'styled-components'

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
  grid-column-gap: 10px;
  align-items: center;
`
const Label = styled.div`
  font-weight: 700;
`
const MapLabel0 = styled(Label)`
  grid-area: mapLabel0;
`
const MapLabel1 = styled(Label)`
  grid-area: mapLabel1;
  justify-self: end;
`
const MapLabel2 = styled(Label)`
  grid-area: mapLabel2;
  justify-self: end;
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
  row,
  updateTpopkontr,
  showFilter,
}: {
  saveToDb: () => void,
  errors: Object,
  row: Object,
  updateTpopkontr: () => void,
  showFilter: boolean,
}) => (
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
            value: value === true ? true : null,
            updateTpopkontr,
          })
        }
        error={errors.planVorhanden}
      />
    </MapVal1>
    <MapLabel2>nein</MapLabel2>
    <MapVal2>
      <RadioButton
        key={`${row.id}planVorhanden2`}
        value={row.planVorhanden === false}
        saveToDb={value =>
          saveToDb({
            row,
            field: 'planVorhanden',
            value: value === true ? false : null,
            updateTpopkontr,
          })
        }
        error={errors.planVorhanden}
      />
    </MapVal2>
  </Container>
)

export default Map
