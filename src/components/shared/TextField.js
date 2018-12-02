// @flow
import React, { useState, useCallback, useEffect } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'
import withLifecycle from '@hocs/with-lifecycle'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose()

const MyTextField = ({
  value,
  label,
  name,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  helperText = '',
  error,
  saveToDb,
}: {
  value: number | string,
  label: String,
  name: String,
  type: String,
  multiLine: Boolean,
  disabled: Boolean,
  hintText: String,
  helperText: String,
  error: String,
  saveToDb: () => void,
}) => {
  const [stateValue, setStateValue] = useState(
    value || value === 0 ? value : '',
  )
  const onChange = useCallback(event => setStateValue(event.target.value))
  useEffect(() => {
    setStateValue(value || value === 0 ? value : '')
  }, [])

  return (
    <StyledFormControl
      fullWidth
      disabled={disabled}
      error={!!error}
      aria-describedby={`${label}ErrorText`}
    >
      <InputLabel htmlFor={label}>{label}</InputLabel>
      <Input
        id={label}
        name={name}
        value={stateValue}
        type={type}
        multiline={multiLine}
        onChange={onChange}
        onBlur={saveToDb}
        placeholder={hintText}
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

export default enhance(MyTextField)
