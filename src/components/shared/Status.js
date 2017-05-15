// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import TextField from './TextField'
import Label from './Label'
import InfoWithPopover from './InfoWithPopover'

const FieldWithInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
`
const PopoverContentRow = styled.div`
  padding: 2px 5px 2px 5px;
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-radius: 4px;
`
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
      props.updatePropertyInDb(props.tree, props.herkunftFieldName, val)
    },
  }),
  observer,
)

const Status = ({
  tree,
  apJahr,
  herkunftFieldName,
  herkunftValue,
  bekanntSeitFieldName,
  bekanntSeitValue,
  bekanntSeitValid,
  updateProperty,
  updatePropertyInDb,
  onChange,
}: {
  tree: Object,
  apJahr?: number,
  herkunftFieldName: string,
  herkunftValue?: number,
  bekanntSeitFieldName: string,
  bekanntSeitValue?: number,
  bekanntSeitValid?: string,
  updateProperty: () => void,
  updatePropertyInDb: () => void,
  onChange: () => void,
}) => {
  const valueSelected = herkunftValue !== null && herkunftValue !== undefined
    ? herkunftValue
    : ``
  const showNachBeginnAp =
    !apJahr || !bekanntSeitValue || apJahr <= bekanntSeitValue
  const disabled = !bekanntSeitValue && bekanntSeitValue !== 0

  return (
    <div>
      <FieldWithInfoContainer>
        <TextField
          tree={tree}
          label="bekannt seit"
          fieldName={bekanntSeitFieldName}
          value={bekanntSeitValue}
          errorText={bekanntSeitValid}
          type="number"
          updateProperty={updateProperty}
          updatePropertyInDb={updatePropertyInDb}
        />
        <InfoWithPopover>
          <PopoverContentRow>
            Dieses Feld immer ausfüllen
          </PopoverContentRow>
        </InfoWithPopover>
      </FieldWithInfoContainer>
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
                value={showNachBeginnAp ? 200 : 210}
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
                value={showNachBeginnAp ? 202 : 211}
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

Status.defaultProps = {
  apJahr: null,
  herkunftValue: null,
  bekanntSeitValue: ``,
  bekanntSeitValid: ``,
}

export default enhance(Status)
