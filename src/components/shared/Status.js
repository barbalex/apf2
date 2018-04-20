// @flow
import React from 'react'
import { observer } from 'mobx-react'
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import Input, { InputLabel } from 'material-ui-next/Input'
import { FormControl, FormHelperText } from 'material-ui-next/Form'
import Radio, { RadioGroup } from 'material-ui-next/Radio'
import { FormControlLabel } from 'material-ui-next/Form'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'

import Label from './Label'
import InfoWithPopover from './InfoWithPopover'

const FieldWithInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: -15px;
  break-inside: avoid;
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
  break-inside: avoid;
`
const HerkunftContainer = styled.div`
  display: flex;
  margin-top: -2px;
  flex-wrap: wrap;
`
const HerkunftColumnContainer = styled.div`
  padding-right: 25px;
  overflow: visible !important;
`
const HerkunftColumnContainerLast = styled.div`
  overflow: visible !important;
`
const GroupLabelContainer = styled.div`
  padding-bottom: 2px;
`
const StyledInput = styled(Input)`
  &:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const StyledRadio = styled(Radio)`
  height: 26px !important;
  max-height: 26px !important;
`

const enhance = compose(
  withHandlers({
    onChangeStatus: props => event => {
      const { value: valuePassed } = event.target
      // if clicked element is active herkunftValue: set null
      // eslint-disable-next-line eqeqeq
      const val = valuePassed == props.herkunftValue ? null : valuePassed
      props.updatePropertyInDb(props.tree, props.herkunftFieldName, val)
    },
    onChangeBekanntSeit: props => event =>
      props.updateProperty(
        props.tree,
        props.bekanntSeitFieldName,
        event.target.value
      ),
    onBlurBekanntSeit: props => event => {
      const { value } = event.target
      // only update if value has changed
      // eslint-disable-next-line eqeqeq
      if (value != props.valueOnFocus) {
        props.updatePropertyInDb(props.tree, props.bekanntSeitFieldName, value)
      }
    },
  }),
  observer
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
  onChangeStatus,
  onChangeBekanntSeit,
  onBlurBekanntSeit,
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
  onChangeStatus: () => void,
  onChangeBekanntSeit: () => void,
  onBlurBekanntSeit: () => void,
}) => {
  const valueSelected =
    herkunftValue !== null && herkunftValue !== undefined ? herkunftValue : ''
  const showNachBeginnAp =
    !apJahr || !bekanntSeitValue || apJahr <= bekanntSeitValue
  const disabled = !bekanntSeitValue && bekanntSeitValue !== 0

  return (
    <div>
      <FieldWithInfoContainer>
        <FormControl
          error={!!bekanntSeitValid}
          disabled={disabled}
          fullWidth
          aria-describedby="bekanntSeitHelper"
        >
          <InputLabel htmlFor="bekanntSeit">bekannt seit</InputLabel>
          <StyledInput
            id="bekanntSeit"
            value={
              bekanntSeitValue || bekanntSeitValue === 0 ? bekanntSeitValue : ''
            }
            type="number"
            onChange={onChangeBekanntSeit}
            onBlur={onBlurBekanntSeit}
            endAdornment={
              <InfoWithPopover>
                <PopoverContentRow>
                  Dieses Feld immer ausfüllen
                </PopoverContentRow>
              </InfoWithPopover>
            }
          />
          <FormHelperText id="bekanntSeitHelper">
            {bekanntSeitValid}
          </FormHelperText>
        </FormControl>
      </FieldWithInfoContainer>
      <StatusContainer>
        <Label label="Status" />
        <HerkunftContainer>
          <HerkunftColumnContainer>
            <GroupLabelContainer>ursprünglich:</GroupLabelContainer>
            <RadioGroup
              aria-label={herkunftFieldName}
              name={herkunftFieldName}
              value={valueSelected.toString()}
              onChange={onChangeStatus}
            >
              <FormControlLabel
                value="100"
                control={<StyledRadio color="primary" />}
                label="aktuell"
                disabled={disabled}
              />
              <FormControlLabel
                value="101"
                control={<StyledRadio color="primary" />}
                label="erloschen"
                disabled={disabled}
              />
            </RadioGroup>
          </HerkunftColumnContainer>
          <HerkunftColumnContainer>
            <GroupLabelContainer>angesiedelt:</GroupLabelContainer>
            <RadioGroup
              aria-label={herkunftFieldName}
              name={herkunftFieldName}
              value={valueSelected.toString()}
              onChange={onChangeStatus}
            >
              <FormControlLabel
                value={showNachBeginnAp ? '200' : '210'}
                control={<StyledRadio color="primary" />}
                label="aktuell"
                disabled={disabled}
              />
              <FormControlLabel
                value="201"
                control={<StyledRadio color="primary" />}
                label="Ansaatversuch"
                disabled={disabled}
              />
              <FormControlLabel
                value={showNachBeginnAp ? '202' : '211'}
                control={<StyledRadio color="primary" />}
                label="erloschen / nicht etabliert"
                disabled={disabled}
              />
            </RadioGroup>
          </HerkunftColumnContainer>
          <HerkunftColumnContainerLast>
            <GroupLabelContainer>potenziell:</GroupLabelContainer>
            <RadioGroup
              aria-label={herkunftFieldName}
              name={herkunftFieldName}
              value={valueSelected.toString()}
              onChange={onChangeStatus}
            >
              <FormControlLabel
                value="300"
                control={<StyledRadio color="primary" />}
                label="potenzieller Wuchs-/Ansiedlungsort"
                disabled={disabled}
              />
            </RadioGroup>
          </HerkunftColumnContainerLast>
        </HerkunftContainer>
      </StatusContainer>
    </div>
  )
}

Status.defaultProps = {
  apJahr: null,
  herkunftValue: null,
  bekanntSeitValue: '',
  bekanntSeitValid: '',
}

export default enhance(Status)
