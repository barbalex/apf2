import React, { useCallback } from 'react'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import FormControlLabel from '@mui/material/FormControlLabel'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

// without slight padding radio is slightly cut off!
const StyledFormControl = styled(FormControl)`
  padding-left: 1px !important;
  padding-bottom: 19px !important;
  break-inside: avoid;
`
const StyledFormLabel = styled(FormLabel)`
  padding-top: 1px !important;
  font-size: 12px !important;
  cursor: text;
  user-select: none;
  pointer-events: none;
  padding-bottom: 8px !important;
`
const StyledRadio = styled(Radio)`
  height: 2px !important;
`

const dataSource = [
  {
    value: true,
    label: 'Ja',
  },
  {
    value: false,
    label: 'Nein',
  },
]

const JesNo = ({ label, helperText = '', saveToDb, value, name, error }) => {
  const onClickButton = useCallback(
    (event) => {
      /**
       * if clicked element is active value: set null
       * Problem: does not work on change event on RadioGroup
       * because that only fires on changes
       * Solution: do this in click event of button
       */
      const targetValue = event.target.value === 'true'
      const fakeEvent = {
        target: {
          value: targetValue,
          name,
        },
      }
      if (targetValue === value) {
        // an already active option was clicked
        // set value null
        fakeEvent.target.value = null
      }
      // It is possible to directly click an option after editing an other field
      // this creates a race condition in the two submits which can lead to lost inputs!
      // so timeout inputs in option fields
      setTimeout(() => saveToDb(fakeEvent))
    },
    [name, saveToDb, value],
  )
  const onChangeGroup = useCallback(
    (event) => {
      // group only changes if value changes
      const targetValue = event.target.value
      // values are passed as strings > need to convert
      const valueToUse =
        targetValue === 'true'
          ? true
          : targetValue === 'false'
          ? false
          : isNaN(targetValue)
          ? targetValue
          : +targetValue
      const fakeEvent = {
        target: {
          value: valueToUse,
          name,
        },
      }
      // It is possible to directly click an option after editing an other field
      // this creates a race condition in the two submits which can lead to lost inputs!
      // so timeout inputs in option fields
      setTimeout(() => saveToDb(fakeEvent))
    },
    [name, saveToDb],
  )

  const valueSelected =
    value !== null && value !== undefined ? value.toString() : ''

  return (
    <StyledFormControl
      component="fieldset"
      error={!!error}
      aria-describedby={`${label}ErrorText`}
      variant="standard"
    >
      <StyledFormLabel component="legend">{label}</StyledFormLabel>
      <RadioGroup
        aria-label={label}
        value={valueSelected}
        onChange={onChangeGroup}
      >
        {dataSource.map((e, index) => {
          const valueToUse = e.value.toString ? e.value.toString() : e.value

          return (
            <FormControlLabel
              key={index}
              value={valueToUse}
              control={
                <StyledRadio
                  data-id={`${name}_${valueToUse}`}
                  color="primary"
                />
              }
              label={e.label}
              onClick={onClickButton}
            />
          )
        })}
      </RadioGroup>
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
      {!!helperText && (
        <FormHelperText id={`${label}HelperText`}>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default observer(JesNo)
