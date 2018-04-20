// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Radio, { RadioGroup } from 'material-ui-next/Radio'
import { FormLabel, FormControl, FormControlLabel } from 'material-ui-next/Form'
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
  height: 24px !important;
`

const enhance = compose(
  withHandlers({
    onChange: props => event => {
      // if clicked element is active value: set null
      // Problem: does not work because change event does not happen
      // Solution: do this in click event of button
      props.updatePropertyInDb(props.tree, props.fieldName, event.target.value)
    },
    onClickButton: props => event => {
      const { value } = event.target
      // eslint-disable-next-line eqeqeq
      if (value == props.value) {
        // an already active tpopId was clicked
        // set value null
        props.updatePropertyInDb(props.tree, props.fieldName, null)
      }
    },
  }),
  observer
)

const RadioButton = ({
  fieldName,
  value,
  label,
  onChange,
  onClickButton,
}: {
  fieldName: string,
  value?: ?number | ?string,
  label: string,
  onChange: () => void,
  onClickButton: () => void,
}) => (
  <StyledFormControl component="fieldset">
    <StyledFormLabel component="legend">{label}</StyledFormLabel>
    <RadioGroup
      aria-label={label}
      name={fieldName}
      value={!!value ? value.toString() : null}
      onChange={onChange}
    >
      <FormControlLabel
        value="1"
        control={<StyledRadio onClick={onClickButton} color="primary" />}
      />
    </RadioGroup>
  </StyledFormControl>
)

RadioButton.defaultProps = {
  value: '',
}

export default enhance(RadioButton)
