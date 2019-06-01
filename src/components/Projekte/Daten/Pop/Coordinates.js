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

const Coordinates = ({ row }) => {
  const { lv95X, lv95Y } = row
  const [lv95XState, setLv95XState] = useState(lv95X)
  const [lv95YState, setLv95YState] = useState(lv95Y)

  // ensure state is updated when changed from outside
  useEffect(() => {
    setLv95XState(lv95X)
    setLv95YState(lv95Y)
  }, [lv95X, lv95Y])

  return (
    <>
      <StyledFormControl
        fullWidth
        error={!!error}
        aria-describedby={`${label}ErrorText`}
      >
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <Input
          id={name}
          name={name}
          value={lv95XState}
          type="number"
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
      </StyledFormControl>
    </>
  )
}

export default observer(Coordinates)
