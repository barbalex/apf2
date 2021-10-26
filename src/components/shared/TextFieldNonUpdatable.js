import React, { useState, useCallback } from 'react'
import Input from '@mui/material/Input'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
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
      variant="standard"
    >
      <InputLabel shrink>{label}</InputLabel>
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
