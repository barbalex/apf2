// @flow
import React from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import styled from 'styled-components'

const StyledTextField = styled(TextField)`
  margin-bottom: -15px;
`

const enhance = compose(
  withState('valueHasBeenChanged', 'changeValueHasBeenChanged', false),
  withHandlers({
    onChange: props => (event, val) => {
      props.updateProperty(props.tree, props.fieldName, val)
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

const MyTextField = ({
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
  label: string,
  fieldName: string,
  value?: ?number | ?string,
  errorText?: ?string,
  type?: string,
  multiLine?: boolean,
  disabled?: boolean,
  hintText?: string,
  onChange: () => void,
  onBlur: () => void,
  // no idea why but this CAN get passed as undefined...
  updateProperty: () => void,
  updatePropertyInDb: () => void,
}) => (
  <StyledTextField
    floatingLabelText={label}
    hintText={hintText}
    type={type}
    multiLine={multiLine}
    value={value || value === 0 ? value : ''}
    errorText={errorText}
    disabled={disabled}
    fullWidth
    onChange={onChange}
    onBlur={onBlur}
  />
)

MyTextField.defaultProps = {
  value: '',
  errorText: '',
  type: 'text',
  multiLine: false,
  disabled: false,
  hintText: '',
  updateProperty: null,
  updatePropertyInDb: null,
}

export default enhance(MyTextField)
