import React, { useCallback, useEffect, useRef } from 'react'
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
  const { errors, handleSubmit } = form
  const error = errors[name]

  // only working solution to prevent whell scrolling from changing number values
  // see: https://github.com/mui-org/material-ui/issues/7960#issuecomment-497945204
  const textFieldRef = useRef(null)
  useEffect(() => {
    const handleWheel = e => e.preventDefault()
    textFieldRef.current.addEventListener('wheel', handleWheel)

    return () => {
      textFieldRef.current.removeEventListener('wheel', handleWheel)
    }
  }, [])

  // value should immediately update when pressing Enter
  const onKeyDown = useCallback(e => {
    if (e.key === 'Enter') {
      handleSubmit()
      // show user something happened
      e.currentTarget.blur()
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
        ref={textFieldRef}
        name={name}
        value={value || value === 0 ? value : ''}
        type={type}
        multiline={multiLine}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
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
