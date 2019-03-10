// @flow
import React from 'react'
import styled from 'styled-components'
import compose from 'recompose/compose'
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys'

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

const enhance = compose(
  onlyUpdateForKeys(['id', 'planVorhanden', 'planVorhandenErrors']),
)

const Map = ({
  id,
  planVorhanden,
  planVorhandenErrors,
  saveToDb,
  row,
  showFilter,
}: {
  id: string,
  planVorhanden: string,
  planVorhandenErrors: string,
  saveToDb: () => void,
  row: Object,
  showFilter: boolean,
}) => (
  <Container>
    <MapLabel0>Plan ergänzt</MapLabel0>
    <MapLabel1>ja</MapLabel1>
    <MapVal1 data-id="planVorhanden_true">
      <RadioButton
        key={`${id}planVorhanden`}
        name="planVorhanden"
        value={planVorhanden}
        saveToDb={saveToDb}
      />
    </MapVal1>
    <MapLabel2>nein</MapLabel2>
    <MapVal2 data-id="planVorhanden_false">
      <RadioButton
        key={`${id}planVorhanden2`}
        name="planVorhanden"
        value={planVorhanden === false}
        saveToDb={() => {
          const fakeEvent = {
            target: { name: 'planVorhanden', value: false },
          }
          saveToDb(fakeEvent)
        }}
        error={planVorhandenErrors}
      />
    </MapVal2>
  </Container>
)

export default enhance(Map)
