// @flow
import React from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import withState from 'recompose/withState'

const enhance = compose(
  withState('valueOnFocus', 'changeValueOnFocus', ''),
  withHandlers({
    onChange: props => (event, val) =>
      props.updateProperty(props.tree, props.fieldName, val),
    onBlur: props => event => {
      const { value } = event.target
      // only update if value has changed
      // eslint-disable-next-line eqeqeq
      if (value != props.valueOnFocus) {
        props.updatePropertyInDb(props.tree, props.fieldName, value)
      }
    },
    onFocus: props => () => props.changeValueOnFocus(props.value),
  }),
  observer,
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
  onFocus,
}: {
  tree: Object,
  label: string,
  fieldName: string,
  value?: ?number | ?string,
  valueOnFocus?: ?number | ?string,
  errorText?: ?string,
  type?: string,
  multiLine?: boolean,
  disabled?: boolean,
  hintText?: string,
  onChange: () => void,
  onBlur: () => void,
  onFocus: () => void,
  // no idea why but this CAN get passed as undefined...
  updateProperty: () => void,
  updatePropertyInDb: () => void,
}) => (
  <TextField
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
    onFocus={onFocus}
  />
)

MyTextField.defaultProps = {
  value: '',
  valueOnFocus: '',
  errorText: '',
  type: 'text',
  multiLine: false,
  disabled: false,
  hintText: '',
  updateProperty: null,
  updatePropertyInDb: null,
}

export default enhance(MyTextField)
