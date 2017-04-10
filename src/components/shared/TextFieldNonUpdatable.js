// @flow
import React from 'react'
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

const MyTextField = (
  {
    label,
    value,
    errorText,
    onChange,
  }:
  {
    label: string,
    value?: ?number|?string,
    errorText: string,
    onChange: () => void,
  }
) =>
  <TextField
    floatingLabelText={label}
    errorText={errorText}
    value={value || value === 0 ? value : ``}
    fullWidth
    errorStyle={{ color: orange500 }}
    onChange={onChange}
  />

MyTextField.defaultProps = {
  value: ``,
}

export default enhance(MyTextField)
