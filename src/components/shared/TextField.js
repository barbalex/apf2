// @flow
import React from 'react'
import { observer } from 'mobx-react'
import Input, { InputLabel } from 'material-ui-next/Input'
import { FormControl, FormHelperText } from 'material-ui-next/Form'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'

const StyledInput = styled(Input)`
  &:before {
    background-color: rgba(0, 0, 0, 0.1) !important;
  }
`

const enhance = compose(
  withState('valueHasBeenChanged', 'changeValueHasBeenChanged', false),
  withHandlers({
    onChange: props => event => {
      let { value } = event.target
      // ensure numbers saved as numbers
      if (event.target.type === 'number') {
        value = +value
      }
      props.updateProperty(props.tree, props.fieldName, value)
      props.changeValueHasBeenChanged(true)
    },
    onBlur: props => event => {
      const { type } = event.target
      let { value } = event.target
      // ensure numbers saved as numbers
      if (type === 'number') {
        value = +value
      }
      const { valueHasBeenChanged, tree, fieldName, updatePropertyInDb } = props
      if (valueHasBeenChanged) {
        updatePropertyInDb(tree, fieldName, value)
      }
    },
  }),
  observer
)

const TextField = ({
  label,
  value,
  errorText,
  type,
  multiLine,
  disabled,
  hintText,
  onChange,
  onBlur,
}: {
  tree: Object,
  label: String,
  fieldName: String,
  value?: ?Number | ?String,
  errorText?: ?String,
  type?: String,
  multiLine?: Boolean,
  disabled?: Boolean,
  hintText?: String,
  onChange: () => void,
  onBlur: () => void,
  // no idea why but this CAN get passed as undefined...
  updateProperty: () => void,
  updatePropertyInDb: () => void,
}) => (
  <FormControl
    error={!!errorText}
    disabled={disabled}
    fullWidth
    aria-describedby={`${label}-helper`}
  >
    <InputLabel htmlFor={label}>{label}</InputLabel>
    <StyledInput
      id={label}
      value={value || value === 0 ? value : ''}
      type={type}
      multiline={multiLine}
      onChange={onChange}
      onBlur={onBlur}
      placeholder={hintText}
    />
    <FormHelperText id={`${label}-helper`}>{errorText}</FormHelperText>
  </FormControl>
)

TextField.defaultProps = {
  value: '',
  errorText: '',
  type: 'text',
  multiLine: false,
  disabled: false,
  hintText: '',
  updateProperty: null,
  updatePropertyInDb: null,
}

export default enhance(TextField)
