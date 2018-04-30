// @flow
import React from 'react'
import Input, { InputLabel } from 'material-ui/Input'
import { FormControl, FormHelperText } from 'material-ui/Form'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { FormControlLabel } from 'material-ui/Form'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import withState from 'recompose/withState'

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
  withState(
    'bekanntSeitStateValue',
    'setBekanntSeitStateValue',
    ({ bekanntSeitValue }) =>
      bekanntSeitValue || bekanntSeitValue === 0 ? bekanntSeitValue : ''
  ),
  withHandlers({
    onChangeStatus: ({ herkunftValue, saveToDbStatus }) => event => {
      const { value: valuePassed } = event.target
      // if clicked element is active herkunftValue: set null
      // eslint-disable-next-line eqeqeq
      const val = valuePassed == herkunftValue ? null : valuePassed
      saveToDbStatus(val)
    },
    onChangeBekanntSeit: ({ setBekanntSeitStateValue }) => event =>
      setBekanntSeitStateValue(event.target.value),
    onBlurBekanntSeit: ({ valueOnFocus, saveToDbBekanntSeit }) => event => {
      const { value } = event.target
      // only update if value has changed
      // eslint-disable-next-line eqeqeq
      if (value != valueOnFocus) {
        saveToDbBekanntSeit(value)
      }
    },
  })
)

const Status = ({
  apJahr,
  herkunftValue,
  bekanntSeitStateValue,
  saveToDbBekanntSeit,
  saveToDbStatus,
  onChangeStatus,
  onChangeBekanntSeit,
  onBlurBekanntSeit,
}: {
  apJahr?: Number,
  herkunftValue?: Number,
  bekanntSeitStateValue: Number,
  saveToDbBekanntSeit: () => void,
  saveToDbStatus: () => void,
  onChangeStatus: () => void,
  onChangeBekanntSeit: () => void,
  onBlurBekanntSeit: () => void,
}) => {
  const valueSelected =
    herkunftValue !== null && herkunftValue !== undefined ? herkunftValue : ''
  const showNachBeginnAp =
    !apJahr || !bekanntSeitStateValue || apJahr <= bekanntSeitStateValue
  const disabled = !bekanntSeitStateValue && bekanntSeitStateValue !== 0

  return (
    <div>
      <FieldWithInfoContainer>
        <FormControl fullWidth aria-describedby="bekanntSeitHelper">
          <InputLabel htmlFor="bekanntSeit">bekannt seit</InputLabel>
          <StyledInput
            id="bekanntSeit"
            value={bekanntSeitStateValue}
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
        </FormControl>
      </FieldWithInfoContainer>
      <StatusContainer>
        <Label label="Status" />
        <HerkunftContainer>
          <HerkunftColumnContainer>
            <GroupLabelContainer>ursprünglich:</GroupLabelContainer>
            <RadioGroup
              aria-label="Status"
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
              aria-label="Status"
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
              aria-label="Status"
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
}

export default enhance(Status)
