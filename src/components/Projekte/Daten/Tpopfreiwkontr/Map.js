// @flow
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

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
  row,
  errors,
  showFilter,
}: {
  saveToDb: () => void,
  row: Object,
  errors: Object,
  showFilter: boolean,
}) => {
  const onSaveFalse = useCallback(() => {
    const fakeEvent = {
      target: { name: 'planVorhanden', value: false },
    }
    saveToDb(fakeEvent)
  })

  return (
    <Container>
      <MapLabel0>Plan ergänzt</MapLabel0>
      <MapLabel1>ja</MapLabel1>
      <MapVal1 data-id="planVorhanden_true">
        <RadioButton
          key={`${row.id}planVorhanden`}
          name="planVorhanden"
          value={row.planVorhanden}
          saveToDb={saveToDb}
        />
      </MapVal1>
      <MapLabel2>nein</MapLabel2>
      <MapVal2 data-id="planVorhanden_false">
        <RadioButton
          key={`${row.id}planVorhanden2`}
          name="planVorhanden"
          value={row.planVorhanden === false}
          saveToDb={onSaveFalse}
          error={errors.planVorhanden}
        />
      </MapVal2>
    </Container>
  )
}

export default observer(Map)
