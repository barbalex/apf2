import React, { useCallback, useEffect, useRef } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useField } from 'formik'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const MyTextField = (props) => {
  const [field, meta] = useField(props)
  const {
    label,
    type = 'text',
    multiLine = false,
    disabled = false,
    hintText = '',
    helperText = '',
    required = false,
  } = props
  const { onChange, onBlur, value, name } = field
  const { error: errors, handleSubmit } = meta
  const error = errors?.[name]

  // only working solution to prevent whell scrolling from changing number values
  // see: https://github.com/mui-org/material-ui/issues/7960#issuecomment-497945204
  // const textFieldRef = useRef(null)
  // useEffect(() => {
  //   const handleWheel = (e) => e.preventDefault()

  //   const current = textFieldRef.current
  //   current.addEventListener('wheel', handleWheel, { passive: false })

  //   return () => {
  //     current.removeEventListener('wheel', handleWheel)
  //   }
  // }, [])

  // value should immediately update when pressing Enter
  const onKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        handleSubmit()
        // show user something happened
        e.currentTarget.blur()
      }
    },
    [handleSubmit],
  )

  return (
    <StyledFormControl
      fullWidth
      disabled={disabled}
      error={!!error}
      aria-describedby={`${label}ErrorText`}
      variant="standard"
    >
      <InputLabel htmlFor={label} shrink required={required}>
        {label}
      </InputLabel>
      <Input
        id={name}
        //ref={textFieldRef}
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
