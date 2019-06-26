import React, { useCallback } from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

// without slight padding radio is slightly cut off!
const StyledFormControl = styled(FormControl)`
  padding-left: 1px !important;
  padding-bottom: 15px !important;
`
const StyledFormLabel = styled(FormLabel)`
  padding-top: 10px !important;
  padding-bottom: 8px !important;
  font-size: 12px !important;
  cursor: text;
  user-select: none;
  pointer-events: none;
`
const StyledRadio = styled(Radio)`
  height: 2px !important;
`

const RadioButton = ({ field, form, label }) => {
  const { onChange, onBlur, value, name } = field
  const { errors, handleSubmit } = form
  const error = errors[name]

  const onClickButton = useCallback(() => {
    const fakeEvent = {
      target: {
        value: !value,
        name,
      },
    }
    onChange(fakeEvent)
    onBlur(fakeEvent)
    setTimeout(() => handleSubmit())
  }, [value, name])

  return (
    <StyledFormControl
      component="fieldset"
      error={!!error}
      aria-describedby={`${label}ErrorText`}
    >
      <StyledFormLabel component="legend">{label}</StyledFormLabel>
      <RadioGroup
        aria-label={label}
        value={
          value === null || value === undefined ? 'false' : value.toString()
        }
      >
        <FormControlLabel
          value="true"
          control={
            <StyledRadio
              data-id={name}
              onClick={onClickButton}
              color="primary"
            />
          }
        />
      </RadioGroup>
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

RadioButton.defaultProps = {
  value: 'false',
}

export default observer(RadioButton)
