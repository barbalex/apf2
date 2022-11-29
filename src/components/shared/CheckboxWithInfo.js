import React, { useCallback } from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import Checkbox from '@mui/material/Checkbox'
import styled from '@emotion/styled'
import { observer } from 'mobx-react-lite'

import InfoWithPopover from './InfoWithPopover'

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  div {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }
`
// without slight padding radio is slightly cut off!
const StyledFormControl = styled(FormControl)`
  padding-left: 1px !important;
  padding-bottom: 15px !important;
`
const StyledFormControlLabel = styled(FormControlLabel)`
  margin-top: -10px;
  .MuiFormControlLabel-label {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
    user-select: none;
  }
`

const CheckboxWithInfo = ({ value, label, name, popover, saveToDb, error }) => {
  const onCheck = useCallback((e, val) => saveToDb(val), [saveToDb])

  return (
    <Container>
      <StyledFormControl
        component="fieldset"
        error={!!error}
        aria-describedby={`${label}ErrorText`}
        variant="standard"
      >
        <FormGroup>
          <StyledFormControlLabel
            label={label}
            control={
              <Checkbox
                checked={value}
                onChange={onCheck}
                value={label}
                color="primary"
                inputProps={{ 'data-id': name }}
              />
            }
          />
        </FormGroup>
        {!!error && (
          <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
        )}
      </StyledFormControl>
      <div>
        <InfoWithPopover name={name}>{popover}</InfoWithPopover>
      </div>
    </Container>
  )
}

CheckboxWithInfo.defaultProps = {
  value: null,
}

export default observer(CheckboxWithInfo)
