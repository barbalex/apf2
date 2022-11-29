import React, { useCallback } from 'react'
import Radio from '@mui/material/Radio'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import styled from '@emotion/styled'
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
  width: 24px;
`

const RadioButton = ({ label, name, value, error, saveToDb }) => {
  const onClickButton = useCallback(() => {
    const fakeEvent = {
      target: {
        value: !value,
        name,
      },
    }
    // It is possible to directly click an option after editing an other field
    // this creates a race condition in the two submits which can lead to lost inputs!
    // so timeout inputs in option fields
    setTimeout(() => saveToDb(fakeEvent))
  }, [name, value, saveToDb])

  return (
    <StyledFormControl
      component="fieldset"
      error={!!error}
      aria-describedby={`${label}ErrorText`}
      variant="standard"
    >
      <StyledFormLabel component="legend">{label}</StyledFormLabel>
      <StyledRadio
        data-id={name}
        onClick={onClickButton}
        color="primary"
        checked={value}
      />
      {!!error && (
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      )}
    </StyledFormControl>
  )
}

export default observer(RadioButton)
