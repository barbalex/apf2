// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Radio, { RadioGroup } from 'material-ui/Radio'
import { FormLabel, FormControl, FormControlLabel } from 'material-ui/Form'
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
  font-size: 12px !important;
  cursor: text;
  user-select: none;
  pointer-events: none;
  padding-bottom: 8px !important;
`
const StyledRadio = styled(Radio)`
  height: 26px !important;
`

const enhance = compose(
  withHandlers({
    onClickButton: ({ updatePropertyInDb, tree, fieldName, value }) => () =>
      updatePropertyInDb(tree, fieldName, !value),
  }),
  observer
)

const RadioButton = ({
  fieldName,
  value,
  label,
  onClickButton,
}: {
  fieldName: String,
  value: Boolean,
  label: String,
  onClickButton: () => void,
}) => (
  <StyledFormControl component="fieldset">
    <StyledFormLabel component="legend">{label}</StyledFormLabel>
    <RadioGroup aria-label={label} name={fieldName} value={value.toString()}>
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
