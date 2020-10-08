import React, { useState, useCallback } from 'react'
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

const MyTextField = ({ label, value = '' }) => {
  const [error, setError] = useState(null)
  const onChange = useCallback(() => {
    setError('Dieser Wert ist nicht veränderbar')
    // can fire after component was unmounted...
    setTimeout(() => setError(null), 5000)
  }, [])

  return (
    <StyledFormControl
      error={!!error}
      fullWidth
      aria-describedby={`${label}-helper`}
    >
      <InputLabel htmlFor={label} shrink>
        {label}
      </InputLabel>
      <Input
        id={label}
        value={value || value === 0 ? value : ''}
        onChange={onChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
      {!!error && (
        <FormHelperText id={`${label}-helper`}>{error}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default observer(MyTextField)
