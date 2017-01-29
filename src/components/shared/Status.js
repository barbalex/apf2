// @flow
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import TextField from './TextField'
import Label from './Label'

const StatusContainer = styled.div`
  padding-top: 10px;
`
const HerkunftContainer = styled.div`
  display: flex;
  margin-top: -2px;
`
const HerkunftColumnContainer = styled.div`
  padding-right: 25px;
`
const GroupLabelContainer = styled.div`
  padding-bottom: 2px;
`
const enhance = compose(
  withHandlers({
    onChange: props => (event, valuePassed) => {
      // if clicked element is active herkunftValue: set null
      const val = valuePassed === props.herkunftValue ? null : valuePassed
      props.updatePropertyInDb(props.herkunftFieldName, val)
    },
  }),
  observer
)

const Status = ({
  apJahr,
  herkunftFieldName,
  herkunftValue,
  bekanntSeitFieldName,
  bekanntSeitValue,
  bekanntSeitValid,
  updateProperty,
  updatePropertyInDb,
  onChange,
}) => {
  const valueSelected = (
    (herkunftValue !== null && herkunftValue !== undefined) ?
    herkunftValue :
    ``
  )
  const showVorBeginnAp = (
    bekanntSeitValue &&
    apJahr &&
    (apJahr > bekanntSeitValue)
  )
  const disabled = !bekanntSeitValue && bekanntSeitValue !== 0

  return (
    <div>
      <TextField
        label="bekannt seit"
        fieldName={bekanntSeitFieldName}
        value={bekanntSeitValue}
        errorText={bekanntSeitValid}
        type="number"
        updateProperty={updateProperty}
        updatePropertyInDb={updatePropertyInDb}
      />
      <StatusContainer>
        <Label label="Status" />
        <HerkunftContainer>
          <HerkunftColumnContainer>
            <GroupLabelContainer>ursprünglich:</GroupLabelContainer>
            <RadioButtonGroup
              name={herkunftFieldName}
              valueSelected={valueSelected}
              onChange={onChange}
            >
              <RadioButton
                value={100}
                label="aktuell"
                key={1}
                disabled={disabled}
              />
              <RadioButton
                value={101}
                label="erloschen"
                key={2}
                disabled={disabled}
              />
            </RadioButtonGroup>
          </HerkunftColumnContainer>
          <HerkunftColumnContainer>
            <GroupLabelContainer>angesiedelt:</GroupLabelContainer>
            <RadioButtonGroup
              name={herkunftFieldName}
              valueSelected={valueSelected}
              onChange={onChange}
            >
              <RadioButton
                value={showVorBeginnAp ? 210 : 200}
                label="aktuell"
                key={1}
                disabled={disabled}
              />
              <RadioButton
                value={201}
                label="Ansaatversuch"
                key={3}
                disabled={disabled}
              />
              <RadioButton
                value={showVorBeginnAp ? 211 : 202}
                label="erloschen / nicht etabliert"
                key={4}
                disabled={disabled}
              />
            </RadioButtonGroup>
          </HerkunftColumnContainer>
          <HerkunftColumnContainer>
            <GroupLabelContainer>potenziell:</GroupLabelContainer>
            <RadioButtonGroup
              name={herkunftFieldName}
              valueSelected={valueSelected}
              onChange={onChange}
            >
              <RadioButton
                value={300}
                label="potenzieller Wuchs-/Ansiedlungsort"
                key={1}
                disabled={disabled}
              />
            </RadioButtonGroup>
          </HerkunftColumnContainer>
        </HerkunftContainer>
      </StatusContainer>
    </div>
  )
}

Status.propTypes = {
  apJahr: PropTypes.number,
  herkunftFieldName: PropTypes.string.isRequired,
  herkunftValue: PropTypes.number,
  bekanntSeitFieldName: PropTypes.string.isRequired,
  bekanntSeitValue: PropTypes.number,
  bekanntSeitValid: PropTypes.string,
  updateProperty: PropTypes.func.isRequired,
  updatePropertyInDb: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
}

Status.defaultProps = {
  apJahr: null,
  herkunftValue: null,
  bekanntSeitValue: ``,
  bekanntSeitValid: ``,
}

export default enhance(Status)
