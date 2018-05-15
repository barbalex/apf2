// @flow
import React from 'react'
import Radio, { RadioGroup } from '@material-ui/core/Radio'
import { FormLabel, FormControl, FormControlLabel } from '@material-ui/core'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import styled from 'styled-components'

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
  height: 26px !important;
`

const enhance = compose(
  withHandlers({
    onClickButton: ({ saveToDb, value }) => () => saveToDb(!value),
  })
)

const RadioButton = ({
  label,
  value,
  onClickButton,
}: {
  label: String,
  value: Boolean,
  onClickButton: () => void,
}) => (
  <StyledFormControl component="fieldset">
    <StyledFormLabel component="legend">{label}</StyledFormLabel>
    <RadioGroup aria-label={label} value={value.toString()}>
      <FormControlLabel
        value="true"
        control={<StyledRadio onClick={onClickButton} color="primary" />}
      />
    </RadioGroup>
  </StyledFormControl>
)

RadioButton.defaultProps = {
  value: 'false',
}

export default enhance(RadioButton)
