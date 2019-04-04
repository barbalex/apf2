// @flow
import React, { useState, useCallback, useEffect } from 'react'
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
  row,
  label,
  name,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  helperText = '',
  errors,
  saveToDb,
}: {
  row: Object,
  label: String,
  name: String,
  type: String,
  multiLine: Boolean,
  disabled: Boolean,
  hintText: String,
  helperText: String,
  errors: Object,
  saveToDb: () => void,
}) => {
  const value = row[name]
  const [stateValue, setStateValue] = useState(
    value || value === 0 ? value : '',
  )
  const onChange = useCallback(event => setStateValue(event.target.value))
  useEffect(() => {
    setStateValue(value || value === 0 ? value : '')
  }, [value])

  const onKeyPress = useCallback(event => {
    if (event.key === 'Enter') {
      saveToDb(event)
    }
  })
  const error = errors ? errors[name] : null

  return (
    <StyledFormControl
      fullWidth
      disabled={disabled}
      error={!!error}
      aria-describedby={`${label}ErrorText`}
    >
      <InputLabel htmlFor={label}>{label}</InputLabel>
      <Input
        id={name}
        name={name}
        value={stateValue}
        type={type}
        multiline={multiLine}
        onChange={onChange}
        onBlur={saveToDb}
        onKeyPress={onKeyPress}
        placeholder={hintText}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
      {!!helperText && (
        <FormHelperText id={`${label}HelperText`}>{helperText}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default observer(MyTextField)
