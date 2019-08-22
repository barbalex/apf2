import React, { useCallback } from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import styled from 'styled-components'
import { observer } from 'mobx-react-lite'

import InfoWithPopover from './InfoWithPopover'
import Label from './Label'

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
`

const CheckboxWithInfo = ({ value, label, name, popover, saveToDb, error }) => {
  const onCheck = useCallback((e, val) => saveToDb(val), [saveToDb])

  return (
    <Container>
      <StyledFormControl
        component="fieldset"
        error={!!error}
        aria-describedby={`${label}ErrorText`}
      >
        <FormGroup>
          <Label label={label} />
          <StyledFormControlLabel
            control={
              <Checkbox
                checked={value}
                onChange={onCheck}
                value={label}
                color="primary"
                data-id={name}
              />
            }
          />
        </FormGroup>
        {!!error && (
          <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
        )}
      </StyledFormControl>
      <div>
        <InfoWithPopover>{popover}</InfoWithPopover>
      </div>
    </Container>
  )
}

CheckboxWithInfo.defaultProps = {
  value: null,
}

export default observer(CheckboxWithInfo)
