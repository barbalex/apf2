import React, { useCallback } from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useField } from 'formik'

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

const JesNo = ({ label, helperText = '', handleSubmit, ...props }) => {
  const [field, meta] = useField(props)
  const { onChange, onBlur, value, name } = field
  const { error: errors } = meta
  const error = errors?.[name]

  const onClickButton = useCallback(
    (event) => {
      /**
       * if clicked element is active value: set null
       * Problem: does not work on change event on RadioGroup
       * because that only fires on changes
       * Solution: do this in click event of button
       */
      const targetValue = event.target.value === 'true'
      if (targetValue === value) {
        // an already active option was clicked
        // set value null
        const fakeEvent = {
          target: {
            value: null,
            name,
          },
        }
        onChange(fakeEvent)
        onBlur(fakeEvent)
        setTimeout(() => handleSubmit())
      }
    },
    [value, name, onChange, onBlur, handleSubmit],
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
      onChange(fakeEvent)
      onBlur(fakeEvent)
      setTimeout(() => handleSubmit())
    },
    [handleSubmit, name, onBlur, onChange],
  )

  const valueSelected =
    value !== null && value !== undefined ? value.toString() : ''

  return (
    <StyledFormControl
      component="fieldset"
      error={!!error}
      aria-describedby={`${label}ErrorText`}
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
