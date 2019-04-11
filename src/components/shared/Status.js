import React, { useState, useCallback, useEffect } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

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
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const StyledRadio = styled(Radio)`
  height: 2px !important;
`

const Status = ({
  apJahr,
  herkunftValue,
  bekanntSeitValue,
  saveToDb,
  treeName,
  showFilter,
}) => {
  const [bekanntSeitStateValue, setBekanntSeitStateValue] = useState(
    bekanntSeitValue || bekanntSeitValue === 0 ? bekanntSeitValue : '',
  )

  const valueSelected =
    herkunftValue !== null && herkunftValue !== undefined ? herkunftValue : ''
  let angesiedeltLabel = 'angesiedelt:'
  if (!!apJahr && !!bekanntSeitStateValue) {
    if (apJahr <= bekanntSeitStateValue) {
      angesiedeltLabel = 'angesiedelt (nach Beginn AP):'
    } else {
      angesiedeltLabel = 'angesiedelt (vor Beginn AP):'
    }
  }
  let disabled = !bekanntSeitStateValue && bekanntSeitStateValue !== 0
  if (showFilter) disabled = false

  const onClickButton = useCallback(
    event => {
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
        return saveToDb(fakeEvent)
      }
    },
    [herkunftValue],
  )
  const onChangeStatus = useCallback(
    event => {
      const { value: valuePassed } = event.target
      // if clicked element is active herkunftValue: set null
      const fakeEvent = {
        target: {
          value: valuePassed == herkunftValue ? null : valuePassed, // eslint-disable-line eqeqeq
          name: 'status',
        },
      }
      saveToDb(fakeEvent)
    },
    [herkunftValue],
  )
  const onChangeBekanntSeit = useCallback(event =>
    setBekanntSeitStateValue(event.target.value ? +event.target.value : ''),
  )
  const onBlurBekanntSeit = useCallback(event => {
    const { value } = event.target
    const fakeEvent = {
      target: { value: value === '' ? null : value, name: 'bekanntSeit' },
    }
    saveToDb(fakeEvent)
  })

  useEffect(() => {
    setBekanntSeitStateValue(
      bekanntSeitValue || bekanntSeitValue === 0 ? bekanntSeitValue : '',
    )
  }, [bekanntSeitValue])

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
                control={<StyledRadio data-id="status_100" color="primary" />}
                label="aktuell"
                disabled={disabled}
                onClick={onClickButton}
              />
              <FormControlLabel
                value="101"
                control={<StyledRadio data-id="status_101" color="primary" />}
                label="erloschen"
                disabled={disabled}
                onClick={onClickButton}
              />
            </RadioGroup>
          </HerkunftColumnContainer>
          <HerkunftColumnContainer>
            <GroupLabelContainer>{angesiedeltLabel}</GroupLabelContainer>
            <RadioGroup
              aria-label="Status"
              value={valueSelected.toString()}
              onChange={onChangeStatus}
            >
              <FormControlLabel
                value="200"
                control={<StyledRadio data-id="status_200" color="primary" />}
                label="aktuell"
                disabled={disabled}
                onClick={onClickButton}
              />
              <FormControlLabel
                value="201"
                control={<StyledRadio data-id="status_201" color="primary" />}
                label="Ansaatversuch"
                disabled={disabled}
                onClick={onClickButton}
              />
              <FormControlLabel
                value="202"
                control={<StyledRadio data-id="status_202" color="primary" />}
                label="erloschen / nicht etabliert"
                disabled={disabled}
                onClick={onClickButton}
              />
            </RadioGroup>
          </HerkunftColumnContainer>
          <HerkunftColumnContainerLast>
            <GroupLabelContainer>potenziell:</GroupLabelContainer>
            <RadioGroup
              aria-label="Status"
              value={valueSelected.toString()}
              onChange={onChangeStatus}
              onClick={onClickButton}
            >
              <FormControlLabel
                value="300"
                control={<StyledRadio data-id="status_300" color="primary" />}
                label="potenzieller Wuchs-/Ansiedlungsort"
                disabled={disabled}
                onClick={onClickButton}
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

export default observer(Status)
