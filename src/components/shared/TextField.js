// @flow
import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import withHandlers from 'recompose/withHandlers'
import compose from 'recompose/compose'
import withState from 'recompose/withState'

const enhance = compose(
  withState(`valueOnFocus`, `changeValueOnFocus`, ``),
  withHandlers({
    onChange: props =>
      (event, val) =>
        props.updateProperty(props.tree, props.fieldName, val),
    onBlur: props =>
      (event) => {
        const { value } = event.target
        // only update if value has changed
        if (value != props.valueOnFocus) {  // eslint-disable-line eqeqeq
          props.updatePropertyInDb(props.tree, props.fieldName, value)
        }
      },
    onFocus: props =>
      () =>
        props.changeValueOnFocus(props.value),
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
  onFocus,
}) =>
  <TextField
    floatingLabelText={label}
    hintText={hintText}
    type={type}
    multiLine={multiLine}
    value={value || value === 0 ? value : ``}
    errorText={errorText}
    disabled={disabled}
    fullWidth
    onChange={onChange}
    onBlur={onBlur}
    onFocus={onFocus}
  />

MyTextField.propTypes = {
  tree: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  fieldName: PropTypes.string.isRequired,
  value: PropTypes.any,
  valueOnFocus: PropTypes.any,
  errorText: PropTypes.string,
  type: PropTypes.string,
  multiLine: PropTypes.bool,
  disabled: PropTypes.bool,
  hintText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  // no idea why but this CAN get passed as undefined...
  updateProperty: PropTypes.func,
  updatePropertyInDb: PropTypes.func,
}

MyTextField.defaultProps = {
  value: ``,
  valueOnFocus: ``,
  errorText: ``,
  type: `text`,
  multiLine: false,
  disabled: false,
  hintText: ``,
  updateProperty: null,
  updatePropertyInDb: null,
}

export default enhance(MyTextField)
