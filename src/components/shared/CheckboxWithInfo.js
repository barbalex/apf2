// @flow
import React from 'react'
import FormGroup from '@material-ui/core/FormGroup'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Checkbox from '@material-ui/core/Checkbox'
import compose from 'recompose/compose'
import withHandlers from 'recompose/withHandlers'
import styled from 'styled-components'

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

const enhance = compose(
  withHandlers({
    onCheck: ({ saveToDb }) => (e, val) => saveToDb(val),
  }),
)

const CheckboxWithInfo = ({
  value,
  label,
  onCheck,
  popover,
  saveToDb,
  error,
}: {
  value?: number | string,
  label: string,
  onCheck: () => void,
  popover: Object,
  saveToDb: () => void,
  error: String,
}) => (
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
            />
          }
        />
      </FormGroup>
      {
        !!error &&
        <FormHelperText id={`${label}ErrorText`}>{error}</FormHelperText>
      }
    </StyledFormControl>
    <div>
      <InfoWithPopover>{popover}</InfoWithPopover>
    </div>
  </Container>
)

CheckboxWithInfo.defaultProps = {
  value: null,
}

export default enhance(CheckboxWithInfo)
