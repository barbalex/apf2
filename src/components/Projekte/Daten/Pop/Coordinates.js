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
  const { lv95X, lv95Y, id } = row
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
        aria-describedby={`${id}lv95XErrorText`}
      >
        <InputLabel htmlFor={label}>{label}</InputLabel>
        <Input
          id={`${id}lv95X`}
          name="lv95X"
          value={lv95XState}
          type="number"
          onChange={onChange}
          onBlur={saveToDb}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
        {!!error && (
          <FormHelperText id={`${id}lv95XErrorText`}>{error}</FormHelperText>
        )}
      </StyledFormControl>
    </>
  )
}

export default observer(Coordinates)
