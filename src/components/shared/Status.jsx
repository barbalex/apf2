import { useState, useEffect } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'

import { InfoWithPopover } from './InfoWithPopover.jsx'
import { ifIsNumericAsNumber } from '../../modules/ifIsNumericAsNumber.js'

import {
  fieldWithInfoContainer,
  popoverContentRow,
  statusContainer,
  herkunftContainer,
  herkunftColumnContainer,
  herkunftColumnContainerLast,
  groupLabelContainer,
  input,
  radio,
  label,
} from './Status.module.css'

export const Status = ({
  apJahr = null,
  showFilter,
  saveToDb,
  row = {},
  errors,
}) => {
  const herkunftValue = row.status
  const bekanntSeitValue = row.bekanntSeit
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

  const onClickButton = (event) => {
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
      // It is possible to directly click an option after editing an other field
      // this creates a race condition in the two submits which can lead to lost inputs!
      // so timeout inputs in option fields
      setTimeout(() => saveToDb(fakeEvent))
      return
    }
  }

  const onChangeStatus = (event) => {
    const { value: valuePassed } = event.target
    // if clicked element is active herkunftValue: set null
    const fakeEvent = {
      target: {
        value: ifIsNumericAsNumber(valuePassed),
        name: 'status',
      },
    }
    // It is possible to directly click an option after editing an other field
    // this creates a race condition in the two submits which can lead to lost inputs!
    // so timeout inputs in option fields
    setTimeout(() => saveToDb(fakeEvent))
  }

  const onChangeBekanntSeit = (event) =>
    setBekanntSeitStateValue(event.target.value ? +event.target.value : '')

  const onBlurBekanntSeit = (event) => {
    const { value } = event.target
    const fakeEvent = {
      target: { value: ifIsNumericAsNumber(value), name: 'bekanntSeit' },
    }
    saveToDb(fakeEvent)
  }

  useEffect(() => {
    setBekanntSeitStateValue(
      bekanntSeitValue || bekanntSeitValue === 0 ? bekanntSeitValue : '',
    )
  }, [bekanntSeitValue])

  // console.log('Status rendering', { statusSelected, apJahr, showFilter, row })

  return (
    <div>
      <div className={fieldWithInfoContainer}>
        <FormControl
          fullWidth
          aria-describedby="bekanntSeitHelper"
          variant="standard"
        >
          <InputLabel htmlFor="bekanntSeit">bekannt seit</InputLabel>
          <Input
            id="bekanntSeit"
            name="bekanntSeit"
            value={bekanntSeitStateValue}
            type="number"
            onChange={onChangeBekanntSeit}
            onBlur={onBlurBekanntSeit}
            endAdornment={
              <InfoWithPopover name="bekanntSeit">
                <div className={popoverContentRow}>
                  Dieses Feld immer ausfüllen
                </div>
              </InfoWithPopover>
            }
            className={input}
          />
        </FormControl>
      </div>
      <div className={statusContainer}>
        <FormControl
          component="fieldset"
          error={!!error}
          aria-describedby="StatusErrorText"
          variant="standard"
        >
          <div
            className={label}
            style={{ color: error ? '#f44336' : 'unset' }}
          >
            Status
          </div>
          <RadioGroup
            aria-label="Status"
            value={statusSelected.toString()}
            onChange={onChangeStatus}
          >
            <div className={herkunftContainer}>
              <div className={herkunftColumnContainer}>
                <div className={groupLabelContainer}>ursprünglich:</div>
                <FormControlLabel
                  value="100"
                  control={
                    <Radio
                      className={radio}
                      data-id="status_100"
                      color="primary"
                    />
                  }
                  label="aktuell"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
                <FormControlLabel
                  value="101"
                  control={
                    <Radio
                      className={radio}
                      data-id="status_101"
                      color="primary"
                    />
                  }
                  label="erloschen"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
              </div>
              <div className={herkunftColumnContainer}>
                <div className={groupLabelContainer}>{angesiedeltLabel}</div>
                <FormControlLabel
                  value="200"
                  control={
                    <Radio
                      className={radio}
                      data-id="status_200"
                      color="primary"
                    />
                  }
                  label="aktuell"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
                <FormControlLabel
                  value="201"
                  control={
                    <Radio
                      className={radio}
                      data-id="status_201"
                      color="primary"
                    />
                  }
                  label="Ansaatversuch"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
                <FormControlLabel
                  value="202"
                  control={
                    <Radio
                      className={radio}
                      data-id="status_202"
                      color="primary"
                    />
                  }
                  label="erloschen / nicht etabliert"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
              </div>
              <div className={herkunftColumnContainerLast}>
                <div className={groupLabelContainer}>potenziell:</div>
                <FormControlLabel
                  value="300"
                  control={
                    <Radio
                      className={radio}
                      data-id="status_300"
                      color="primary"
                    />
                  }
                  label="potenzieller Wuchs-/Ansiedlungsort"
                  disabled={statusDisabled}
                  onClick={onClickButton}
                />
              </div>
            </div>
          </RadioGroup>
          {!!error && (
            <FormHelperText id="StatusErrorText">{error}</FormHelperText>
          )}
        </FormControl>
      </div>
    </div>
  )
}
