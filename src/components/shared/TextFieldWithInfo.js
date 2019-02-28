// @flow
import React, { useState, useCallback, useEffect } from 'react'
import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import FormHelperText from '@material-ui/core/FormHelperText'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

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
  value: propsValue,
  label,
  name,
  type = 'text',
  multiLine = false,
  disabled = false,
  hintText = '',
  popover,
  saveToDb,
  error,
}: {
  value: Number | String,
  label: String,
  name: String,
  type: String,
  multiLine: Boolean,
  disabled: Boolean,
  hintText: String,
  error: String,
  popover: Object,
  saveToDb: () => void,
}) => {
  const [stateValue, setStateValue] = useState(
    propsValue || propsValue === 0 ? propsValue : '',
  )
  const onChange = useCallback(event => setStateValue(event.target.value))
  useEffect(() => {
    setStateValue(propsValue || propsValue === 0 ? propsValue : '')
  }, [propsValue])

  const onKeyPress = useCallback(event => {
    if (event.key === 'Enter') {
      saveToDb(event)
    }
  })

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
        onKeyPress={onKeyPress}
        placeholder={hintText}
        endAdornment={
          <InfoWithPopover>
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
