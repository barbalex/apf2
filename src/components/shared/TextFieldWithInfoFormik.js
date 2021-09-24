import React, { useCallback } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import { useField } from 'formik'

import InfoWithPopover from './InfoWithPopover'

const StyledFormControl = styled(FormControl)`
  padding-bottom: 19px !important;
  > div:before {
    border-bottom-color: rgba(0, 0, 0, 0.1) !important;
  }
`
const PopoverContentRow = styled.div`
  padding: 2px 5px 2px 5px;
  display: flex;
  border-color: grey;
  border-width: thin;
  border-style: solid;
  border-radius: 4px;
`

const TextFieldWithInfo = ({
  label,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  popover,
  ...props
}) => {
  const [field, meta] = useField(props)
  const { onChange, onBlur, value, name } = field
  const { error: errors, handleSubmit } = meta
  const error = errors?.[name]

  const onKeyPress = useCallback(
    (event) => {
      event.key === 'Enter' && handleSubmit()
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
      <InputLabel htmlFor={label} shrink>
        {label}
      </InputLabel>
      <Input
        id={name}
        name={name}
        value={value || value === 0 ? value : ''}
        type={type}
        multiline={multiLine}
        onChange={onChange}
        onBlur={onBlur}
        onKeyPress={onKeyPress}
        placeholder={hintText}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        endAdornment={
          <InfoWithPopover name={name}>
            <PopoverContentRow>{popover}</PopoverContentRow>
          </InfoWithPopover>
        }
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default observer(TextFieldWithInfo)
