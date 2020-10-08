import React, { useState, useCallback, useEffect } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useField } from 'formik'

import InfoWithPopover from './InfoWithPopover'
import ifIsNumericAsNumber from '../../modules/ifIsNumericAsNumber'

const FieldWithInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
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
  display: flex;
  flex-direction: column;
`
const HerkunftColumnContainerLast = styled.div`
  overflow: visible !important;
`
const GroupLabelContainer = styled.div`
  padding-bottom: 2px;
`
const StyledInput = styled(Input)`
  &:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const StyledRadio = styled(Radio)`
  height: 2px !important;
`
const StyledLabel = styled.div`
  margin-top: 10px;
  cursor: text;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
  pointer-events: none;
  user-select: none;
  padding-bottom: 8px;
  color: ${(props) => (props.error ? '#f44336' : 'unset')};
`

const Status = ({ apJahr, treeName, showFilter, handleSubmit, ...props }) => {
  const [field, meta] = useField(props)
  const { onChange, onBlur } = field
  const { value, error: errors } = meta
  const herkunftValue = value.status
  const bekanntSeitValue = value.bekanntSeit
  const error = errors?.status || errors?.bekanntSeit

  const [bekanntSeitStateValue, setBekanntSeitStateValue] = useState(
    bekanntSeitValue || bekanntSeitValue === 0 ? bekanntSeitValue : '',
  )

  const statusSelected =
    herkunftValue !== null && herkunftValue !== undefined ? herkunftValue : ''

  let angesiedeltLabel = 'angesiedelt:'
  if (!!apJahr && !!bekanntSeitStateValue) {
    if (apJahr <= bekanntSeitStateValue) {
      angesiedeltLabel = 'angesiedelt (nach Beginn AP):'
    } else {
      angesiedeltLabel = 'angesiedelt (vor Beginn AP):'
    }
  }
  let statusDisabled = !bekanntSeitStateValue && bekanntSeitStateValue !== 0
  if (showFilter) statusDisabled = false

  const onClickButton = useCallback(
    (event) => {
      /**
       * if clicked element is active value: set null
       * Problem: does not work on change event on RadioGroup
       * because that only fires on changes
       * Solution: do this in click event of button
       */
      const targetValue = event.target.value
      // eslint-disable-next-line eqeqeq
      if (targetValue !== undefined && targetValue == herkunftValue) {
        // an already active option was clicked
        // set value null
        const fakeEvent = {
          target: { value: null, name: 'status' },
        }
        onChange(fakeEvent)
        onBlur(fakeEvent)
        setTimeout(() => handleSubmit())
        return
      }
    },
    [onBlur, onChange, handleSubmit, herkunftValue],
  )
  const onChangeStatus = useCallback(
    (event) => {
      const { value: valuePassed } = event.target
      // if clicked element is active herkunftValue: set null
      const fakeEvent = {
        target: {
          value: ifIsNumericAsNumber(valuePassed),
          name: 'status',
        },
      }
      onChange(fakeEvent)
      onBlur(fakeEvent)
      setTimeout(() => handleSubmit())
    },
    [onBlur, onChange, handleSubmit],
  )
  const onChangeBekanntSeit = useCallback(
    (event) =>
      setBekanntSeitStateValue(event.target.value ? +event.target.value : ''),
    [],
  )
  const onBlurBekanntSeit = useCallback(
    (event) => {
      const { value } = event.target
      const fakeEvent = {
        target: { value: ifIsNumericAsNumber(value), name: 'bekanntSeit' },
      }
      onChange(fakeEvent)
      onBlur(fakeEvent)
      setTimeout(() => handleSubmit())
    },
    [onBlur, onChange, handleSubmit],
  )

  useEffect(() => {
    setBekanntSeitStateValue(
      bekanntSeitValue || bekanntSeitValue === 0 ? bekanntSeitValue : '',
    )
  }, [bekanntSeitValue])

  //console.log('Status rendering')

  return (
    <div>
      <FieldWithInfoContainer>
        <FormControl fullWidth aria-describedby="bekanntSeitHelper">
          <InputLabel htmlFor="bekanntSeit">bekannt seit</InputLabel>
          <StyledInput
            id="bekanntSeit"
            name="bekanntSeit"
            value={bekanntSeitStateValue}
            type="number"
            onChange={onChangeBekanntSeit}
            onBlur={onBlurBekanntSeit}
            endAdornment={
              <InfoWithPopover name="bekanntSeit">
                <PopoverContentRow>
                  Dieses Feld immer ausfüllen
                </PopoverContentRow>
              </InfoWithPopover>
            }
          />
        </FormControl>
      </FieldWithInfoContainer>
      <StatusContainer>
        <FormControl
          component="fieldset"
          error={!!error}
          aria-describedby="StatusErrorText"
        >
          <StyledLabel error={!!error}>Status</StyledLabel>
          <RadioGroup
            aria-label="Status"
            value={statusSelected.toString()}
            onChange={onChangeStatus}
          >
            <HerkunftContainer>
              <HerkunftColumnContainer>
                <GroupLabelContainer>ursprünglich:</GroupLabelContainer>
                <FormControlLabel
                  value="100"
                  control={<StyledRadio data-id="status_100" color="primary" />}
                  label="aktuell"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
                <FormControlLabel
                  value="101"
                  control={<StyledRadio data-id="status_101" color="primary" />}
                  label="erloschen"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
              </HerkunftColumnContainer>
              <HerkunftColumnContainer>
                <GroupLabelContainer>{angesiedeltLabel}</GroupLabelContainer>
                <FormControlLabel
                  value="200"
                  control={<StyledRadio data-id="status_200" color="primary" />}
                  label="aktuell"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
                <FormControlLabel
                  value="201"
                  control={<StyledRadio data-id="status_201" color="primary" />}
                  label="Ansaatversuch"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
                <FormControlLabel
                  value="202"
                  control={<StyledRadio data-id="status_202" color="primary" />}
                  label="erloschen / nicht etabliert"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
              </HerkunftColumnContainer>
              <HerkunftColumnContainerLast>
                <GroupLabelContainer>potenziell:</GroupLabelContainer>
                <FormControlLabel
                  value="300"
                  control={<StyledRadio data-id="status_300" color="primary" />}
                  label="potenzieller Wuchs-/Ansiedlungsort"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
              </HerkunftColumnContainerLast>
            </HerkunftContainer>
          </RadioGroup>
          {!!error && (
            <FormHelperText id="StatusErrorText">{error}</FormHelperText>
          )}
        </FormControl>
      </StatusContainer>
    </div>
  )
}

Status.defaultProps = {
  apJahr: null,
  herkunftValue: null,
  bekanntSeitValue: '',
}

export default observer(Status)
