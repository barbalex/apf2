import React, { PropTypes } from 'react'
import { observer } from 'mobx-react'
import TextField from 'material-ui/TextField'
import { orange500 } from 'material-ui/styles/colors'
import compose from 'recompose/compose'
import withState from 'recompose/withState'
import withHandlers from 'recompose/withHandlers'

const enhance = compose(
  withState(`errorText`, `updateErrorText`, ``),
  withHandlers({
    onChange: props => () => {
      props.updateErrorText(`Dieser Wert ist nicht veränderbar`)
      setTimeout(() => props.updateErrorText(``), 5000)
    },
  }),
  observer
)

const MyTextField = ({
  label,
  value,
  errorText,
  onChange,
}) =>
  <TextField
    floatingLabelText={label}
    errorText={errorText}
    value={value || ``}
    fullWidth
    errorStyle={{ color: orange500 }}
    onChange={onChange}
  />

MyTextField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  errorText: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

MyTextField.defaultProps = {
  value: ``,
}

export default enhance(MyTextField)
