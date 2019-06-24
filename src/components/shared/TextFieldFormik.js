import React, { useCallback } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const MyTextField = ({
  field,
  form,
  label,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  helperText = '',
  required = false,
}) => {
  const { onChange, onBlur, value, name } = field
  const { touched, errors } = form
  const error = errors[name]
  const onKeyPress = useCallback(event => {
    if (event.key === 'Enter') {
      onBlur(event)
    }
  })

  return (
    <StyledFormControl
      fullWidth
      disabled={disabled}
      error={!!error}
      aria-describedby={`${label}ErrorText`}
    >
      <InputLabel htmlFor={label} shrink required={required}>
        {label}
      </InputLabel>
      <Input
        id={name}
        name={name}
        value={value}
        type={type}
        multiline={multiLine}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        placeholder={hintText}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        onWheel={event => {
          event.preventDefault()
        }}
      />
      {touched[name] && !!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
      {!!helperText && (
        <FormHelperText id={`${label}HelperText`}>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default observer(MyTextField)
